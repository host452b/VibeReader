// load shared modules
importScripts('api-utils.js');
importScripts('i18n.js');

// Enable the side panel to open when the action icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('Failed to set panel behavior:', error));

// track last-seen URL per tab to avoid re-processing on same-URL updates
const tabUrls = new Map();

// listen for tab updates to trigger auto summary
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // only process when page load is complete
  if (changeInfo.status !== 'complete') return;
  
  // skip special pages
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
    return;
  }

  // check if URL has changed for this tab
  const lastUrl = tabUrls.get(tabId);
  if (lastUrl === tab.url) {
    return; // same URL, don't re-process
  }
  tabUrls.set(tabId, tab.url);

  // check if auto sum is enabled
  const settings = await chrome.storage.sync.get({ autoSumEnabled: false });
  if (!settings.autoSumEnabled) return;

  // trigger auto summary
  await triggerAutoSum(tabId, tab.url);
});

// clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabUrls.delete(tabId);
});

// send message to tab with retry (content script may not be ready immediately)
// total timeout of 5s prevents indefinite blocking if tab is unresponsive
async function sendMessageWithRetry(tabId, message, maxRetries) {
  if (!maxRetries) maxRetries = 3;
  var lastError = null;
  var deadline = Date.now() + 5000; // 5s total timeout
  for (var i = 0; i < maxRetries; i++) {
    if (Date.now() >= deadline) break;
    try {
      return await chrome.tabs.sendMessage(tabId, message);
    } catch (err) {
      lastError = err;
      // wait before retry: 300ms, 600ms, 900ms
      var delay = Math.min((i + 1) * 300, deadline - Date.now());
      if (delay <= 0) break;
      await new Promise(function(resolve) {
        setTimeout(resolve, delay);
      });
    }
  }
  throw lastError;
}

// trigger auto summary for a tab
async function triggerAutoSum(tabId, url) {
  // skip auto summary if cloud consent not yet given
  var provider = (await chrome.storage.sync.get({ provider: API_DEFAULTS.provider })).provider;
  var preset = API_PROVIDERS[provider];
  if (preset && preset.requiresKey) {
    var consent = await chrome.storage.local.get({ cloudConsentGiven: false });
    if (!consent.cloudConsentGiven) return;
  }
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['autosum.js']
    });

    await new Promise(resolve => setTimeout(resolve, 400));

    var langSettings = await chrome.storage.sync.get({ lang: I18N_DEFAULT });
    var lang = langSettings.lang || I18N_DEFAULT;

    await sendMessageWithRetry(tabId, { action: 'showAutoSum', lang: lang }, 3);

    // directly execute content extraction function in page context
    const results = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: extractPageContent
    });

    const pageContent = results?.[0]?.result || '';
    // removed verbose logging

    if (!pageContent || pageContent.length < 50) {
      await chrome.tabs.sendMessage(tabId, { 
        action: 'autoSumResult', 
        success: false, 
        error: 'No content to summarize (length: ' + pageContent.length + ')' 
      });
      return;
    }

    // truncate content if too long (for auto summary, use smaller context)
    const maxLength = 8000;
    let truncatedContent = pageContent;
    if (truncatedContent.length > maxLength) {
      truncatedContent = truncatedContent.substring(0, maxLength) + '\n\n[Content truncated...]';
    }

    // call API to summarize
    const summary = await callSummarizeAPI(truncatedContent, url);
    
    // send result to content script
    await chrome.tabs.sendMessage(tabId, { 
      action: 'autoSumResult', 
      success: true, 
      summary: summary 
    });

  } catch (error) {
    console.error('Auto summary error:', error);
    try {
      await chrome.tabs.sendMessage(tabId, { 
        action: 'autoSumResult', 
        success: false, 
        error: error.message || 'Failed to summarize' 
      });
    } catch (e) {
      // tab might be closed
    }
  }
}

// content extraction function - runs in page context
function extractPageContent() {
  // try user selection first
  const selection = window.getSelection().toString().trim();
  if (selection && selection.length > 0) {
    return selection;
  }

  // clone body to avoid modifying original DOM
  const clone = document.body.cloneNode(true);
  
  // remove junk elements
  const junkSelectors = [
    'script', 'style', 'noscript', 'iframe', 'svg',
    '.ad', '.ads', '.advertisement'
  ];
  
  junkSelectors.forEach(sel => {
    clone.querySelectorAll(sel).forEach(el => el.remove());
  });

  // gather meta info
  let metaInfo = "";
  const title = document.title;
  const description = document.querySelector('meta[name="description"]')?.content;
  const keywords = document.querySelector('meta[name="keywords"]')?.content;
  const pageUrl = window.location.href;
  
  metaInfo += `Title: ${title}\n`;
  metaInfo += `URL: ${pageUrl}\n`;
  if (description) metaInfo += `Description: ${description}\n`;
  if (keywords) metaInfo += `Keywords: ${keywords}\n`;
  metaInfo += `----------------------------------------\n\n`;

  // get visible text
  let visibleText = clone.innerText || clone.textContent || '';

  // clean up whitespace
  visibleText = visibleText
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/[ \t]+/g, ' ');

  const lines = visibleText.split('\n');
  const cleanedLines = lines
    .map(line => line.trim())
    .filter(line => line.length > 0);
    
  visibleText = cleanedLines.join('\n');
  
  // fallback if too short
  if (!visibleText || visibleText.length < 50) {
    return metaInfo + (document.body.innerText || document.body.textContent || '');
  }

  return metaInfo + visibleText;
}

// call API to get summary (uses shared api-utils.js functions)
async function callSummarizeAPI(content, url) {
  var settings = await chrome.storage.sync.get({
    lang: I18N_DEFAULT,
    provider: API_DEFAULTS.provider,
    apiFormat: API_DEFAULTS.apiFormat,
    baseUrl: API_DEFAULTS.baseUrl,
    model: API_DEFAULTS.model,
    reasoningEffort: API_DEFAULTS.reasoningEffort
  });
  // load API key from local storage (never synced to Google account)
  var localData = await chrome.storage.local.get({ apiKey: API_DEFAULTS.apiKey });
  settings.apiKey = localData.apiKey;

  if (!settings.baseUrl) {
    throw new Error('API not configured. Please check settings.');
  }

  // ollama doesn't require a key; cloud providers do
  var preset = API_PROVIDERS[settings.provider];
  if (preset && preset.requiresKey && !settings.apiKey) {
    throw new Error('API key not configured. Please check settings.');
  }

  var lang = settings.lang || I18N_DEFAULT;
  var promptPrefix = getAutoSumPromptForLang(lang);
  var userPrompt = promptPrefix
    + 'URL: ' + url + '\n\n'
    + 'Content:\n' + content;

  var messages = [{ role: 'user', content: userPrompt }];

  var apiUrl = constructApiUrl(settings);
  var headers = buildApiHeaders(settings);
  var payload = buildApiPayload(messages, settings);

  var response = await fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  });

  var responseText = await response.text();

  if (!response.ok) {
    throw new Error('API Error ' + response.status + ': ' + responseText.substring(0, 200));
  }

  var data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    throw new Error('Failed to parse API response as JSON');
  }

  var summary = extractApiResponse(data);

  if (!summary || summary.trim() === '') {
    console.error('Could not extract summary from response structure:', Object.keys(data));
    throw new Error('API returned empty response. Check console for details.');
  }

  return summary.trim();
}

// listen for retry requests from content script.
// PERF: only return true (keep port open) when we actually handle the message.
// returning true for unhandled messages leaks the message port.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'retryAutoSum' && sender.tab) {
    triggerAutoSum(sender.tab.id, sender.tab.url);
    sendResponse({ status: 'retrying' });
    return true;
  }
  // unhandled message: return false (default) to close the port immediately
});
