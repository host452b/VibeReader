document.addEventListener('DOMContentLoaded', function() {
  const sendBtn = document.getElementById('send-btn');
  const stopBtn = document.getElementById('stop-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const flowBtn = document.getElementById('flow-btn');
  const clearBtn = document.getElementById('clear-btn');
  const refreshBtn = document.getElementById('refresh-btn');
  const rawBtn = document.getElementById('raw-btn');
  const rawDot = document.getElementById('raw-dot');
  const rawPanel = document.getElementById('raw-panel');
  const rawEditor = document.getElementById('raw-content-editor');
  const rawMarkers = document.getElementById('raw-markers-overlay');
  const rawStats = document.getElementById('raw-stats');
  
  // Search Elements
  const searchInput = document.getElementById('raw-search-input');
  const searchPrevBtn = document.getElementById('raw-search-prev');
  const searchNextBtn = document.getElementById('raw-search-next');
  const searchCountDisplay = document.getElementById('raw-search-count');
  
  let searchMatches = [];
  let currentSearchIndex = -1;

  // debounce utility: delays execution until idle for `wait` ms.
  // returns a wrapper function. call wrapper.cancel() to abort pending call.
  function debounce(fn, wait) {
    let timerId = null;
    function debounced() {
      var args = arguments;
      var self = this;
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(function() {
        timerId = null;
        fn.apply(self, args);
      }, wait);
    }
    debounced.cancel = function() {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
    };
    return debounced;
  }
  
  const userInput = document.getElementById('user-input');
  const chatDisplay = document.getElementById('chat-display');
  const promptSelect = document.getElementById('prompt-template');
  const currentUrlDisplay = document.getElementById('current-url');
  const screenStatus = document.getElementById('screen-status');
  // PERF: cache animation target refs once instead of querying on every status change
  const vuMeterEl = document.getElementById('vu-meter');
  const heartbeatEl = document.querySelector('.heartbeat-strip');

  // --- HUD status indicator ---
  // cycles through states: STANDBY -> READY -> IDLE
  // switches to LIVE (with .active class) during API calls
  const STATUS_IDLE_STATES = ['STANDBY', 'IDLE', 'READY', 'SYS:OK', 'AWAIT'];
  let statusCycleIndex = 0;
  let statusCycleTimer = null;
  // track the "resume cycle" timeout so it can be cancelled
  let statusResumeTimeout = null;

  function startStatusCycle() {
    // only cycle when not actively transmitting
    if (statusCycleTimer) return;
    screenStatus.classList.remove('active');
    statusCycleTimer = setInterval(function() {
      statusCycleIndex = (statusCycleIndex + 1) % STATUS_IDLE_STATES.length;
      screenStatus.textContent = STATUS_IDLE_STATES[statusCycleIndex];
    }, 4000);
  }

  // cancel all status timers (interval + pending resume timeout)
  function clearAllStatusTimers() {
    if (statusCycleTimer) {
      clearInterval(statusCycleTimer);
      statusCycleTimer = null;
    }
    if (statusResumeTimeout) {
      clearTimeout(statusResumeTimeout);
      statusResumeTimeout = null;
    }
  }

  function setStatusLive() {
    clearAllStatusTimers();
    screenStatus.textContent = 'LIVE';
    screenStatus.classList.add('active');
    // activate VU meter + heartbeat animation (using cached refs)
    if (vuMeterEl) vuMeterEl.classList.add('active');
    if (heartbeatEl) heartbeatEl.classList.add('active');
  }

  function setStatusDone() {
    clearAllStatusTimers();
    screenStatus.classList.remove('active');
    screenStatus.textContent = 'DONE';
    // deactivate VU meter + heartbeat animation (using cached refs)
    if (vuMeterEl) vuMeterEl.classList.remove('active');
    if (heartbeatEl) heartbeatEl.classList.remove('active');
    // resume cycling after a brief pause (tracked to avoid leak)
    statusResumeTimeout = setTimeout(function() {
      statusResumeTimeout = null;
      startStatusCycle();
    }, 3000);
  }

  // start the idle cycle on load
  startStatusCycle();

  // count newline characters without creating an array (O(n) scan, no allocation)
  function countNewlines(str) {
    if (!str) return 0;
    var count = 0;
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) === 10) count++;
    }
    return count;
  }

  // PERF: raw version — called by debounced wrapper, not directly on every keystroke
  function updateRawStatsImmediate() {
    if (!rawStats) return;
    var text = rawEditor.value;
    // count lines by scanning for newlines (no array allocation like split)
    var lineCount = text ? countNewlines(text) + 1 : 0;
    // rough token estimate: ~4 chars per token for English/mixed content
    var tokenEst = text ? Math.round(text.length / 4) : 0;
    var suffix = '';
    if (tokenEst >= 1000) {
      suffix = (tokenEst / 1000).toFixed(1) + 'k';
    } else {
      suffix = String(tokenEst);
    }
    rawStats.textContent = 'L:' + lineCount + ' T:~' + suffix;
  }

  // debounced wrapper: fires at most once per 120ms during rapid typing
  var updateRawStats = debounce(updateRawStatsImmediate, 120);

  // store page content context (potentially large HTML string)
  let pageContext = "";
  // store last bot response for context continuity
  let lastBotResponse = "";
  // abort controller for stopping requests
  let abortController = null;
  // track if context has been viewed
  let hasUnreadContext = false;

  // --- request timer system ---
  // tracks elapsed time, stores history, predicts ETA
  var requestTimer = {
    _startMs: 0,
    _intervalId: null,
    _el: null,
    _history: [],
    _maxHistory: 10,

    // load past durations from storage
    init: function() {
      var self = this;
      chrome.storage.local.get({ requestDurations: [] }, function(data) {
        self._history = data.requestDurations || [];
      });
    },

    // calculate rolling average of past request durations (seconds)
    _averageSec: function() {
      if (this._history.length === 0) return 0;
      var sum = 0;
      for (var i = 0; i < this._history.length; i++) {
        sum += this._history[i];
      }
      return sum / this._history.length;
    },

    // create timer display element and start counting
    start: function(parentId) {
      this.stop();
      this._startMs = Date.now();

      var container = document.createElement('div');
      container.className = 'request-timer';
      container.id = 'request-timer-live';

      var elapsed = document.createElement('span');
      elapsed.className = 'timer-elapsed';
      elapsed.textContent = '0.0s';
      container.appendChild(elapsed);

      var avg = this._averageSec();
      if (avg > 0) {
        var eta = document.createElement('span');
        eta.className = 'timer-eta';
        eta.textContent = '~' + avg.toFixed(0) + 's est.';
        container.appendChild(eta);
      }

      this._el = container;

      // attach to the loading message
      var parent = document.getElementById(parentId);
      if (parent) {
        parent.appendChild(container);
      }

      // start live tick
      var self = this;
      this._intervalId = setInterval(function() {
        var sec = (Date.now() - self._startMs) / 1000;
        if (elapsed) {
          elapsed.textContent = sec.toFixed(1) + 's';
        }
      }, 100);
    },

    // stop timer and record duration
    stop: function() {
      if (this._intervalId) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
      if (this._startMs > 0) {
        var durationSec = (Date.now() - this._startMs) / 1000;
        // only record reasonable durations (> 0.5s)
        if (durationSec > 0.5) {
          this._history.push(Math.round(durationSec * 10) / 10);
          if (this._history.length > this._maxHistory) {
            this._history.shift();
          }
          chrome.storage.local.set({ requestDurations: this._history });
        }
        this._startMs = 0;
      }
      if (this._el && this._el.parentNode) {
        this._el.parentNode.removeChild(this._el);
      }
      this._el = null;
    },

    // get a formatted summary line for completion messages
    summary: function() {
      var last = this._history.length > 0
        ? this._history[this._history.length - 1]
        : 0;
      var avg = this._averageSec();
      if (last <= 0) return '';
      var text = last.toFixed(1) + 's';
      if (this._history.length >= 2) {
        text += ' (avg ' + avg.toFixed(1) + 's over ' + this._history.length + ' calls)';
      }
      return text;
    }
  };
  requestTimer.init();

  // Virtual Scrolling State
  let lineCache = [];
  let lineStartIndices = [];
  const LINE_HEIGHT = 20; // Must match CSS
  const BUFFER_LINES = 5;

  // current language (loaded from storage, defaults to 'en')
  var currentLang = I18N_DEFAULT;

  // apply language to all UI text elements
  function applyLanguage(lang) {
    currentLang = lang;
    applyLangFont(lang);

    // button labels
    var btnMap = {
      'send-btn':    'transmit',
      'stop-btn':    'stop',
      'refresh-btn': 'refresh',
      'raw-btn':     'rawTxt',
      'flow-btn':    'flow',
      'settings-btn':'cfg',
      'clear-btn':   'clr'
    };
    for (var id in btnMap) {
      var el = document.getElementById(id);
      if (el) {
        var label = el.querySelector('.btn-label');
        if (label) {
          label.textContent = t(lang, btnMap[id]);
        } else {
          el.textContent = t(lang, btnMap[id]);
        }
      }
    }

    // textarea placeholder
    if (userInput) {
      userInput.placeholder = t(lang, 'inputPlaceholder');
    }

    // search placeholder
    var searchInput = document.getElementById('raw-search-input');
    if (searchInput) {
      searchInput.placeholder = t(lang, 'searchPlaceholder');
    }

    // template dropdown first option
    if (promptSelect && promptSelect.options.length > 0) {
      promptSelect.options[0].textContent = t(lang, 'manualMode');
    }
  }

  // default templates from i18n (language-aware)
  function getDefaultTemplates() {
    return getTemplatesForLang(currentLang);
  }

  var DEFAULT_TEMPLATES = getDefaultTemplates();

  let availableTemplates = [];

  // load configuration with sensible defaults pre-filled.
  // new users get working defaults; returning users get their saved values.
  let config = {};

  chrome.storage.sync.get(
    {
      lang: I18N_DEFAULT,
      provider: API_DEFAULTS.provider,
      apiFormat: API_DEFAULTS.apiFormat,
      baseUrl: API_DEFAULTS.baseUrl,
      model: API_DEFAULTS.model,
      reasoningEffort: API_DEFAULTS.reasoningEffort,
      selectedTemplate: '',
      promptTemplates: null,
      systemPrompt: ''
    },
    function(items) {
      // load API key from local storage (never synced to Google account)
      chrome.storage.local.get({ apiKey: API_DEFAULTS.apiKey }, function(localItems) {
        items.apiKey = localItems.apiKey;
        config = items;

        // apply language before rendering any text
        currentLang = items.lang || I18N_DEFAULT;
        DEFAULT_TEMPLATES = getDefaultTemplates();
        applyLanguage(currentLang);

        // load templates
        availableTemplates = items.promptTemplates || DEFAULT_TEMPLATES;
        populateTemplateDropdown(availableTemplates, items.selectedTemplate);

        var loadPreset = API_PROVIDERS[config.provider];
        var needsKey = loadPreset && loadPreset.requiresKey && !config.apiKey;
        if (!config.baseUrl || needsKey) {
          appendSystemMessage(t(currentLang, 'configureApi'));
        } else {
          // try to fetch page content immediately when popup opens
          fetchPageContent();
        }
      });
    }
  );

  function populateTemplateDropdown(templates, selectedId) {
    promptSelect.innerHTML = '<option value="">MANUAL MODE</option>';
    templates.forEach(t => {
      const option = document.createElement('option');
      option.value = t.id;
      option.textContent = t.name;
      promptSelect.appendChild(option);
    });
    if (selectedId) {
      promptSelect.value = selectedId;
    }
  }

  // Save template selection when changed
  promptSelect.addEventListener('change', function() {
    const selected = promptSelect.value;
    chrome.storage.sync.set({ selectedTemplate: selected });
  });

  // fetch content from current active tab
  function fetchPageContent() {
    currentUrlDisplay.textContent = t(currentLang, 'scanning');
    if (loadedPagesEl) loadedPagesEl.style.display = 'none';
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs && tabs.length > 0) {
        const tab = tabs[0];
        const tabId = tab.id;
        const tabUrl = tab.url || "Unknown URL";
        
        // execute script to get content
        chrome.scripting.executeScript({
          target: {tabId: tabId},
          files: ['content.js']
        }, function() {
          // check if scripting injection failed
          if (chrome.runtime.lastError) {
             console.warn('Script injection failed: ' + chrome.runtime.lastError.message);
             appendSystemMessage('Note: Cannot read content from this page type (injection failed).');
             currentUrlDisplay.textContent = "Target: [Signal Lost]";
             return;
          }

          // after injection (or if already injected), send message
          chrome.tabs.sendMessage(tabId, {action: "getPageContent"}, function(response) {
            if (chrome.runtime.lastError) {
              // handle error (e.g. cannot access chrome:// pages)
              console.warn('Could not get page content: ' + chrome.runtime.lastError.message);
              appendSystemMessage('Note: Cannot read content from this page type.');
              currentUrlDisplay.textContent = "Target: [Restricted]";
            } else if (response && response.content) {
              pageContext = response.content;
              // Update URL display with full URL
              const displayUrl = tabUrl;
              currentUrlDisplay.textContent = "Target: " + displayUrl;
              currentUrlDisplay.title = tabUrl; // tooltip shows full url
              
              // Update Raw Editor
              rawEditor.value = pageContext;
              updateRawStats();
              updateLineCache();
              renderVirtualOverlay();
              
              // Mark as unread if panel is closed
              if (!rawPanel.classList.contains('open')) {
                hasUnreadContext = true;
                rawDot.style.display = 'block';
              }
              
              appendSystemMessage('Page HTML content loaded from new target.');
            }
          });
        });
      }
    });
  }

  // --- multi-tab context (floating window) ---
  var addTabBtn = document.getElementById('add-tab-btn');
  var pickerWindowId = null;

  function openTabPickerWindow() {
    if (pickerWindowId) {
      chrome.windows.update(pickerWindowId, { focused: true });
      return;
    }
    var w = 440;
    var h = 360;
    chrome.windows.getLastFocused(function(parentWin) {
      var left = 0;
      var top = 0;
      if (parentWin) {
        left = Math.round(parentWin.left + (parentWin.width - w) / 2);
        top = Math.round(parentWin.top + (parentWin.height - h) / 2);
      }
      chrome.windows.create({
        url: chrome.runtime.getURL('tab-picker.html'),
        type: 'popup',
        width: w,
        height: h,
        left: Math.max(0, left),
        top: Math.max(0, top),
        focused: true
      }, function(win) {
        if (win) pickerWindowId = win.id;
      });
    });
  }

  chrome.windows.onRemoved.addListener(function(windowId) {
    if (windowId === pickerWindowId) pickerWindowId = null;
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // only accept messages from our own extension
    if (sender.id !== chrome.runtime.id) return;
    if (request.action === 'tabPickerResult' && request.tabIds) {
      if (pickerWindowId) {
        chrome.windows.remove(pickerWindowId);
        pickerWindowId = null;
      }
      fetchMultiTabContent(request.tabIds);
    }
  });

  function inlineExtractContent() {
    var selection = window.getSelection().toString().trim();
    if (selection && selection.length > 0) return selection;

    var clone = document.body.cloneNode(true);
    var junk = ['script','style','noscript','iframe','svg','.ad','.ads','.advertisement'];
    junk.forEach(function(sel) {
      clone.querySelectorAll(sel).forEach(function(el) { el.remove(); });
    });

    var meta = '';
    meta += 'Title: ' + document.title + '\n';
    meta += 'URL: ' + window.location.href + '\n';
    var desc = document.querySelector('meta[name="description"]');
    if (desc && desc.content) meta += 'Description: ' + desc.content + '\n';
    meta += '----------------------------------------\n\n';

    var text = clone.innerText || clone.textContent || '';
    text = text.replace(/\n\s*\n\s*\n/g, '\n\n').replace(/[ \t]+/g, ' ');
    var lines = text.split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
    text = lines.join('\n');

    if (!text || text.length < 50) {
      return meta + (document.body.innerText || document.body.textContent || '');
    }
    return meta + text;
  }

  function fetchSingleTabContent(tabId, callback) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }, function() {
      if (chrome.runtime.lastError) {
        tryInlineExtract(tabId, callback);
        return;
      }

      setTimeout(function() {
        chrome.tabs.sendMessage(tabId, { action: 'getPageContent' }, function(response) {
          if (chrome.runtime.lastError || !response || !response.content) {
            tryInlineExtract(tabId, callback);
            return;
          }
          callback(response.content, null);
        });
      }, 200);
    });
  }

  function tryInlineExtract(tabId, callback) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: inlineExtractContent
    }, function(results) {
      if (chrome.runtime.lastError) {
        callback(null, chrome.runtime.lastError.message);
        return;
      }
      var content = results && results[0] && results[0].result;
      if (content && content.length > 0) {
        callback(content, null);
      } else {
        callback(null, 'no content extracted');
      }
    });
  }

  function fetchMultiTabContent(tabIds) {
    if (!tabIds || tabIds.length === 0) return;
    currentUrlDisplay.textContent = t(currentLang, 'scanning');

    chrome.tabs.query({}, function(allTabs) {
      var tabMap = {};
      for (var i = 0; i < allTabs.length; i++) tabMap[allTabs[i].id] = allTabs[i];
      var results = [];
      var completed = 0;
      var total = tabIds.length;
      for (var idx = 0; idx < tabIds.length; idx++) {
        (function(index, id) {
          fetchSingleTabContent(id, function(content, error) {
            var tab = tabMap[id] || {};
            results[index] = { title: tab.title || 'Unknown', url: tab.url || '', content: content, error: error };
            completed++;
            if (completed === total) mergeAndApplyContent(results);
          });
        })(idx, tabIds[idx]);
      }
    });
  }

  var loadedPagesEl = document.getElementById('loaded-pages');

  function mergeAndApplyContent(results) {
    var parts = [];
    var successCount = 0;
    var totalPages = results.length;

    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var header = '\u2550\u2550\u2550\u2550\u2550\u2550 Page ' + (i + 1) + '/' + totalPages + ': ' + r.title + ' \u2550\u2550\u2550\u2550\u2550\u2550';
      if (r.content) {
        parts.push(header + '\nURL: ' + r.url + '\n\n' + r.content);
        successCount++;
      } else {
        parts.push(header + '\nURL: ' + r.url + '\n\n[Error: ' + r.error + ']');
      }
    }

    pageContext = parts.join('\n\n');
    rawEditor.value = pageContext;
    updateRawStats();
    updateLineCache();
    renderVirtualOverlay();

    if (!rawPanel.classList.contains('open')) {
      hasUnreadContext = true;
      rawDot.style.display = 'block';
    }

    var sizeKb = (pageContext.length / 1024).toFixed(0);
    currentUrlDisplay.textContent = 'Target: ' + successCount + '/' + totalPages + ' ' + t(currentLang, 'tabPages') + ' (' + sizeKb + ' KB)';
    currentUrlDisplay.title = results.map(function(r) { return r.url; }).join('\n');

    // show loaded pages list
    if (loadedPagesEl && results.length > 0) {
      loadedPagesEl.innerHTML = '';
      for (var j = 0; j < results.length; j++) {
        var r2 = results[j];
        var item = document.createElement('div');
        item.className = 'loaded-page-item';

        var num = document.createElement('span');
        num.className = 'loaded-page-num';
        num.textContent = (j + 1) + '.';
        item.appendChild(num);

        var titleSpan = document.createElement('span');
        titleSpan.className = 'loaded-page-title';
        titleSpan.textContent = r2.title;
        titleSpan.title = r2.url;
        item.appendChild(titleSpan);

        var status = document.createElement('span');
        status.className = 'loaded-page-status';
        if (r2.content) {
          var kb = (r2.content.length / 1024).toFixed(0);
          status.textContent = kb + 'KB';
          status.classList.add('loaded-page-ok');
        } else {
          status.textContent = r2.error || 'err';
          status.classList.add('loaded-page-err');
        }
        item.appendChild(status);

        loadedPagesEl.appendChild(item);
      }
      loadedPagesEl.style.display = 'block';
    }

    appendSystemMessage(
      t(currentLang, 'tabLoaded')
        .replace('{n}', String(successCount))
        .replace('{total}', String(totalPages))
        .replace('{kb}', sizeKb)
    );
  }

  if (addTabBtn) {
    addTabBtn.addEventListener('click', function() {
      openTabPickerWindow();
    });
  }

  // open options page
  settingsBtn.addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
  
  // show flow diagram
  flowBtn.addEventListener('click', function() {
    var ctxKb = pageContext ? (pageContext.length / 1024).toFixed(0) : '0';
    const flowText = `VIBEREADER ANALYSIS FLOW
=========================
[START]
   │
   ▼
[1/4 CAPTURE SIGNAL]
   │  • Single Page: Inject content.js → Extract DOM
   │  • Multi Page:  [+ Add Page] → Select Tabs
   │    → Parallel extraction (file inject + inline fallback)
   │    → Merge with ══════ Page N/M ══════ separators
   │  • Store in Memory (RAW_TXT)
   │  • Current: ${ctxKb} KB loaded
   │
   ▼
[2/4 MODULATION]
   │  • User Input + Template Merge
   │  • Edit Context in RAW_TXT (Optional)
   │  • Multi-Turn Context Chain
   │  • Context Size: ${ctxKb} KB
   │  • Est. Tokens: ~${Math.round(pageContext ? pageContext.length / 4 : 0)}
   │
   ▼
[3/4 API UPLINK]
   │  • Route: Universal (18 providers)
   │  • Combine: System Prompt + Context + Query
   │  • Model Select (CFG)
   │  • Retry on 429/5xx (Backoff: 2s→4s→8s)
   │
   │  <Context Overflow?>
   │      │
   │      └─ YES ──┐
   │               ▼
   │        [BINARY SPLIT STRATEGY]
   │        │  • Split at Natural Boundaries
   │        │  • Multi-page separators preserved
   │        │  • Process N Chunks Sequentially
   │        │    (2x → 4x → 8x → 16x)
   │        │  • Chain Partial Analyses
   │        │  • Guard Prompt Overflow
   │        │
   │        ▼
   │        [SYNTHESIS]
   │        │  • Merge All Partial Results
   │        │  • Cross-page correlation analysis
   │        │  • Produce Unified Response
   │        │  • Fallback: Last Partial Result
   │        │
   │      ┌─┘
   │      │
   │      └─ NO ─── [Receive Response]
   │
   ▼
[4/4 OUTPUT SIGNAL]
   • Render Response (Markdown)
   • Highlight Root Causes
   • Copy-to-Clipboard per Message
   • Timer: Elapsed + ETA`;
   
    appendSystemMessage(flowText);
  });

  // clear chat
  clearBtn.addEventListener('click', function() {
    chatDisplay.innerHTML = '';
    appendSystemMessage('Chat cleared.');
    lastBotResponse = ""; // Clear history
    // re-announce page context availability if present
    if (pageContext) {
      appendSystemMessage('Page HTML context remains active.');
    }
  });

  // refresh context
  refreshBtn.addEventListener('click', function() {
    fetchPageContent();
  });
  
  // raw txt button toggle
  rawBtn.addEventListener('click', function() {
    // Check if open by class name
    if (!rawPanel.classList.contains('open')) {
      rawPanel.style.display = 'flex'; // Ensure it's part of layout
      // Use setTimeout to allow display:flex to render before adding class for transition
      setTimeout(() => {
        rawPanel.classList.add('open');
        updateLineCache(); // Ensure cache is ready
        renderVirtualOverlay(); // Render on open
      }, 10);
      
      // clear unread status
      hasUnreadContext = false;
      rawDot.style.display = 'none';
      
      // Sync editor with current context just in case
      if (rawEditor.value !== pageContext) {
          rawEditor.value = pageContext;
          updateRawStats();
          updateLineCache();
          renderVirtualOverlay();
      }
    } else {
      rawPanel.classList.remove('open');
      // Wait for transition to finish before hiding
      setTimeout(() => {
        rawPanel.style.display = 'none';
      }, 500); // Match transition duration
    }
  });

  // Handle raw editor changes.
  // only schedule ONE debounced render per input event, even if search is active.
  rawEditor.addEventListener('input', function() {
    pageContext = rawEditor.value;
    updateRawStats();
    updateLineCache();
    // re-run search to update indices (this internally calls renderVirtualOverlay)
    if (searchMatches.length > 0) {
      performSearch(searchInput.value);
      // performSearch already queues a render, skip the extra one
      return;
    }
    renderVirtualOverlay();
  });
  
  // Handle raw editor changes via keyboard (delete, cut, paste etc)
  // Input event covers most, but ensure markers update immediately
  // No special handler needed if input fires.
  
  // scroll syncing is handled by the scroll handler below (translateY approach).
  // DO NOT call renderFullOverlay on scroll - that would rebuild the entire
  // markers DOM on every pixel scrolled, causing catastrophic jank.

  // --- Search Functionality ---
  // debounce search: regex on large text (500k+) can take 50-100ms,
  // firing on every keystroke causes visible stutter.
  var debouncedSearch = debounce(function() {
    performSearch(searchInput.value);
  }, 150);

  searchInput.addEventListener('input', function() {
    debouncedSearch();
  });

  searchNextBtn.addEventListener('click', function() {
    navigateSearch(1);
  });

  searchPrevBtn.addEventListener('click', function() {
    navigateSearch(-1);
  });

  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        navigateSearch(-1);
      } else {
        navigateSearch(1);
      }
      e.preventDefault();
    }
  });

  function performSearch(query) {
    if (!query) {
      searchMatches = [];
      currentSearchIndex = -1;
      searchCountDisplay.textContent = "0/0";
      renderVirtualOverlay(); // Re-render without search highlights
      return;
    }

    const text = rawEditor.value;
    // Debounce/limit large searches? For now, standard regex is ok for <1MB on modern machines
    // For 500k+, regex can take 50-100ms.
    
    // Safety check for empty query
    if (query.length === 0) return;

    try {
        const regex = new RegExp(escapeRegExp(query), 'gi');
        searchMatches = [];
        
        let match;
        while ((match = regex.exec(text)) !== null) {
          searchMatches.push({
            start: match.index,
            end: match.index + match[0].length
          });
          // Prevent infinite loop on zero-length matches (regex edge case)
          if (match.index === regex.lastIndex) {
              regex.lastIndex++;
          }
        }

        currentSearchIndex = searchMatches.length > 0 ? 0 : -1;
        updateSearchUI();
        renderVirtualOverlay(); // Re-render with highlights
        
        // Only scroll to match if User explicitly requested next/prev or pressed Enter
        // NOT on every input keystroke, otherwise focus is stolen from input.
        // Actually, typical find-in-page jumps to first match on input.
        // BUT we must ensure focus stays on input.
        
        if (currentSearchIndex !== -1) {
          scrollToMatch(currentSearchIndex, false); // false = do not steal focus
        }
    } catch (e) {
        console.error("Search error", e);
    }
  }

  function navigateSearch(direction) {
    if (searchMatches.length === 0) return;

    currentSearchIndex += direction;
    
    if (currentSearchIndex >= searchMatches.length) {
      currentSearchIndex = 0; // Loop back to start
    } else if (currentSearchIndex < 0) {
      currentSearchIndex = searchMatches.length - 1; // Loop to end
    }

    updateSearchUI();
    renderVirtualOverlay(); // Re-render to update active highlight
    scrollToMatch(currentSearchIndex, true); // true = focus editor to show match context? 
    // Actually navigating usually implies we want to see it.
    // But if user clicks Next button, keeping focus on button or input is fine.
    // Let's defaulting to NOT stealing focus from controls, but scrolling editor.
  }

  function updateSearchUI() {
    if (searchMatches.length > 0) {
      searchCountDisplay.textContent = `${currentSearchIndex + 1}/${searchMatches.length}`;
    } else {
      searchCountDisplay.textContent = "0/0";
    }
  }

  function scrollToMatch(index, focusEditor = true) {
    const match = searchMatches[index];
    
    // Calculating scroll position manually to avoid focus steal
    // We need to find which line the match is on.
    // Binary search or linear scan lineStartIndices
    let lineIdx = 0;
    // Simple linear scan optimization: start from approximate
    for (let i = 0; i < lineStartIndices.length; i++) {
        if (lineStartIndices[i] > match.start) {
            break;
        }
        lineIdx = i;
    }
    
    // Calculate pixel position
    const targetTop = lineIdx * LINE_HEIGHT;
    
    // Scroll editor
    // Center the match
    const viewportHeight = rawEditor.clientHeight;
    rawEditor.scrollTop = Math.max(0, targetTop - (viewportHeight / 2));
    
    if (focusEditor) {
        rawEditor.setSelectionRange(match.start, match.end);
        rawEditor.focus();
    } else {
        // Just visually scroll, don't select text to avoid focus shift
        // We rely on the 'active-match' highlight in renderVirtualOverlay to show position
    }
    
    // Trigger render update
    renderVirtualOverlay();
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  // ----------------------------

  // updateLineCache is now a no-op placeholder.
  // the actual overlay rebuild is triggered by callers via renderVirtualOverlay()
  // which goes through debounce. previously this function called renderFullOverlay()
  // directly, completely bypassing the debounce and causing double renders.
  function updateLineCache() {
    // intentionally empty: rendering is deferred to renderVirtualOverlay()
  }

  // debounced version: prevents full DOM rebuild from firing more than
  // once every 80ms during rapid typing or scroll-triggered re-renders.
  var debouncedRenderOverlay = debounce(renderFullOverlay, 80);

  function renderVirtualOverlay() {
      // use debounced render to avoid UI thrashing
      debouncedRenderOverlay();
  }
  
  // threshold above which syntax highlighting is skipped (too expensive).
  // only escaped text + position markers are rendered.
  var SYNTAX_HIGHLIGHT_LIMIT = 100000;
  var MARKER_INTERVAL = 10000;

  function renderFullOverlay() {
      var text = rawEditor.value;
      var useSyntax = text.length <= SYNTAX_HIGHLIGHT_LIMIT;
      var buffer = [];
      var currentPos = 0;
      var nextMarkerPos = MARKER_INTERVAL;

      while (currentPos < text.length) {
          var chunkEnd = text.length;
          var markerLabel = '';

          if (text.length > nextMarkerPos) {
              chunkEnd = nextMarkerPos;
              markerLabel = (nextMarkerPos / 1000) + 'k';
              nextMarkerPos += MARKER_INTERVAL;
          }

          var chunk = text.substring(currentPos, chunkEnd);
          var escaped = escapeHtml(chunk);

          // only run regex-based syntax highlighting for reasonably-sized text
          if (useSyntax) {
              buffer.push(applySyntaxHighlighting(escaped));
          } else {
              buffer.push(escaped);
          }

          if (markerLabel) {
              buffer.push(
                '<span class="marker-anchor" data-label="' + markerLabel + '">'
                + '<span class="marker-line-visible">|</span></span>'
              );
          }

          currentPos = chunkEnd;
      }

      rawMarkers.innerHTML = buffer.join('');
      // scroll sync is handled by the translateY scroll handler (not here).
  }
  
  // sync overlay scroll via GPU-compositable transform (no layout reflow)
  rawEditor.addEventListener('scroll', function() {
    rawMarkers.style.transform = 'translateY(-' + rawEditor.scrollTop + 'px)';
  });
  
  function applySyntaxHighlighting(text) {
    // Simple Regex-based highlighter for HTML
    return text
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="hl-comment">$1</span>')
      .replace(/(&lt;\/?)(\w+)([\s\S]*?)(&gt;)/g, function(match, start, tagName, attrs, end) {
         let processedAttrs = attrs;
         processedAttrs = processedAttrs.replace(/([a-zA-Z0-9:-]+)(=)(&quot;.*?&quot;|&#039;.*?&#039;|[^ \t\n\f/>]+)/g, 
            '<span class="hl-attr">$1</span>$2<span class="hl-string">$3</span>');
         return `<span class="hl-bracket">${start}</span><span class="hl-tag">${tagName}</span>${processedAttrs}<span class="hl-bracket">${end}</span>`;
      });
  }
  
  // single-pass HTML escaping with a static lookup map.
  // avoids 5 chained .replace() calls that each scan the full string
  // and allocate an intermediate copy (= 5x scans, 5x allocations).
  var _escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  var _escapeRe = /[&<>"']/g;
  function escapeHtml(unsafe) {
    return unsafe.replace(_escapeRe, function(ch) {
      return _escapeMap[ch];
    });
  }

  // send message
  sendBtn.addEventListener('click', sendMessage);

  // stop request
  stopBtn.addEventListener('click', function() {
    if (abortController) {
      abortController.abort();
      abortController = null;
      appendSystemMessage('Transmission aborted by user.');
      toggleStopButton(false);
    }
  });
  
  // handle enter key (shift+enter for new line)
  userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // --- cloud data consent dialog ---
  function isCloudProvider(providerKey) {
    var preset = API_PROVIDERS[providerKey];
    return preset && preset.requiresKey;
  }

  function showCloudConsent(providerLabel) {
    return new Promise(function(resolve) {
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;';

      var dialog = document.createElement('div');
      dialog.style.cssText = 'background:#fff;border-radius:12px;padding:24px;max-width:340px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.2);font-family:var(--font);';

      var title = document.createElement('div');
      title.style.cssText = 'font-size:15px;font-weight:700;margin-bottom:12px;';
      title.textContent = t(currentLang, 'cloudConsentTitle');
      dialog.appendChild(title);

      var msg = document.createElement('div');
      msg.style.cssText = 'font-size:13px;color:#57534E;margin-bottom:16px;line-height:1.6;';
      msg.textContent = t(currentLang, 'cloudConsentMessage').replace('{provider}', providerLabel);
      dialog.appendChild(msg);

      var checkLabel = document.createElement('label');
      checkLabel.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:12px;color:#57534E;margin-bottom:16px;cursor:pointer;';
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      var checkText = document.createTextNode(t(currentLang, 'cloudConsentRemember'));
      checkLabel.appendChild(checkbox);
      checkLabel.appendChild(checkText);
      dialog.appendChild(checkLabel);

      var btnRow = document.createElement('div');
      btnRow.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;';

      var cancelBtn2 = document.createElement('button');
      cancelBtn2.style.cssText = 'padding:6px 16px;border:1px solid #E7E5E4;border-radius:6px;background:#fff;cursor:pointer;font-size:12px;';
      cancelBtn2.textContent = t(currentLang, 'cloudConsentCancel');
      cancelBtn2.onclick = function() { overlay.remove(); resolve(false); };
      btnRow.appendChild(cancelBtn2);

      var okBtn = document.createElement('button');
      okBtn.style.cssText = 'padding:6px 16px;border:none;border-radius:6px;background:#1C1917;color:#fff;cursor:pointer;font-size:12px;';
      okBtn.textContent = t(currentLang, 'cloudConsentOk');
      okBtn.onclick = function() {
        if (checkbox.checked) {
          chrome.storage.local.set({ cloudConsentGiven: true });
        }
        overlay.remove();
        resolve(true);
      };
      btnRow.appendChild(okBtn);

      dialog.appendChild(btnRow);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
    });
  }

  async function checkCloudConsent() {
    if (!isCloudProvider(config.provider)) return true;
    var data = await new Promise(function(resolve) {
      chrome.storage.local.get({ cloudConsentGiven: false }, resolve);
    });
    if (data.cloudConsentGiven) return true;
    var providerPreset = API_PROVIDERS[config.provider];
    var label = providerPreset ? providerPreset.label : config.provider;
    return showCloudConsent(label);
  }

  function sendMessage() {
    const text = userInput.value.trim();
    if (!text) {
      return;
    }

    if (!config.baseUrl) {
      appendSystemMessage('Error: Base URL not configured. Please check settings.');
      return;
    }
    var providerPreset = API_PROVIDERS[config.provider];
    if (providerPreset && providerPreset.requiresKey && !config.apiKey) {
      appendSystemMessage('Error: API key required for ' + providerPreset.label + '. Please check settings.');
      return;
    }

    // cloud consent check — show dialog if first time using cloud provider
    checkCloudConsent().then(function(consented) {
      if (!consented) {
        appendSystemMessage(t(currentLang, 'cloudConsentCancel'));
        return;
      }
      doSendMessage(text);
    });
  }

  function doSendMessage(text) {
    const loadingId = appendSystemMessage(t(currentLang, 'stage1'));
    requestTimer.start(loadingId);
    toggleStopButton(true);

    // --- stage 1: modulation ---
    const selectedTemplateId = promptSelect.value;
    let finalPrompt = text;

    // merge with last bot response if available
    if (lastBotResponse) {
      finalPrompt = t(currentLang, 'aiPreviousReply') + "\n" + lastBotResponse + "\n\n" + text;
    }

    const template = availableTemplates.find(t => t.id === selectedTemplateId);
    if (template) {
      finalPrompt = template.content + "\n" + finalPrompt;
      updateProgress(loadingId,
        '[1/4] Modulating signal... [Template: ' + template.name + ']');
    }

    if (template) {
      appendMessage('user', "[MODE: " + template.name + "]\n" + text);
    } else {
      appendMessage('user', text);
    }

    userInput.value = '';

    var contextLen = pageContext ? pageContext.length : 0;
    var contextKb = (contextLen / 1024).toFixed(1);
    var estTokens = Math.round(contextLen / 4);
    if (contextLen > 0) {
      var sizeInfo = contextKb + ' KB (~' + estTokens + ' tokens)';
      if (estTokens > 100000) {
        sizeInfo += ' \u2192 Split likely';
      }
      updateProgress(loadingId, t(currentLang, 'stage2ctx') + sizeInfo);
    } else {
      updateProgress(loadingId, t(currentLang, 'stage2none'));
    }

    // pass pageContext explicitly to start with full context
    performRequest(finalPrompt, loadingId, pageContext);
  }

  // --- split strategy helpers ---

  // check if an API error indicates context window overflow.
  // uses a two-tier approach:
  //   - "definite" patterns are strong enough on their own (no status check)
  //   - "general" patterns also need a relevant HTTP status to avoid false positives
  function isContextOverflowError(errorMsg) {
    if (!errorMsg) return false;
    const msg = errorMsg.toLowerCase();

    // tier 1: patterns that are unambiguous overflow indicators
    var definitePatterns = [
      'contextwindowexceedederror',
      'context_length_exceeded',
      'maximum context length',
      'content_length_limit',
      'prompt is too long',
      'input is too long',
      'string too long',
      'reduce the length',
      'reduce your prompt',
      'too many tokens',
      'exceeds the model'
    ];
    if (definitePatterns.some(function(p) { return msg.includes(p); })) {
      return true;
    }

    // tier 2: general patterns that need an HTTP status to confirm
    var generalPatterns = [
      'context window',
      'max_tokens',
      'token limit',
      'request too large',
      'payload too large',
      'request entity too large',
      'body is too large'
    ];
    var hasGeneralKeyword = generalPatterns.some(function(p) {
      return msg.includes(p);
    });
    // relevant status codes: 400 bad request, 413 payload too large, 422 unprocessable
    var hasRelevantStatus = msg.includes('400')
      || msg.includes('413')
      || msg.includes('422');
    return hasGeneralKeyword && hasRelevantStatus;
  }

  // find the best natural boundary near a target position.
  // prefers paragraph breaks > line breaks > sentence ends > word breaks.
  function findNaturalSplitPoint(text, targetPos) {
    if (targetPos >= text.length) return text.length;
    if (targetPos <= 0) return 0;

    // search window: look ±500 chars around the target
    const searchRadius = 500;
    const searchStart = Math.max(0, targetPos - searchRadius);
    const searchEnd = Math.min(text.length, targetPos + searchRadius);
    const window = text.substring(searchStart, searchEnd);

    // priority 1: paragraph break (\n\n)
    const paraBreaks = [];
    let idx = window.indexOf('\n\n');
    while (idx !== -1) {
      paraBreaks.push(searchStart + idx + 2); // position after the break
      idx = window.indexOf('\n\n', idx + 1);
    }
    if (paraBreaks.length > 0) {
      return pickClosest(paraBreaks, targetPos);
    }

    // priority 2: line break (\n)
    const lineBreaks = [];
    idx = window.indexOf('\n');
    while (idx !== -1) {
      lineBreaks.push(searchStart + idx + 1);
      idx = window.indexOf('\n', idx + 1);
    }
    if (lineBreaks.length > 0) {
      return pickClosest(lineBreaks, targetPos);
    }

    // priority 3: sentence end (. ! ?)
    const sentenceEnds = [];
    const sentenceRegex = /[.!?]\s/g;
    let match;
    while ((match = sentenceRegex.exec(window)) !== null) {
      sentenceEnds.push(searchStart + match.index + match[0].length);
    }
    if (sentenceEnds.length > 0) {
      return pickClosest(sentenceEnds, targetPos);
    }

    // priority 4: word break (space)
    const spaces = [];
    idx = window.indexOf(' ');
    while (idx !== -1) {
      spaces.push(searchStart + idx + 1);
      idx = window.indexOf(' ', idx + 1);
    }
    if (spaces.length > 0) {
      return pickClosest(spaces, targetPos);
    }

    // fallback: use the raw target position
    return targetPos;
  }

  // pick the candidate position closest to target
  function pickClosest(candidates, target) {
    let best = candidates[0];
    let bestDist = Math.abs(best - target);
    for (let i = 1; i < candidates.length; i++) {
      const dist = Math.abs(candidates[i] - target);
      if (dist < bestDist) {
        best = candidates[i];
        bestDist = dist;
      }
    }
    return best;
  }

  // split text into N chunks at natural boundaries
  function splitIntoChunks(text, segments) {
    if (segments <= 1) return [text];

    const chunkSize = Math.ceil(text.length / segments);
    const chunks = [];
    let currentPos = 0;

    for (let i = 0; i < segments; i++) {
      if (currentPos >= text.length) break;

      // last chunk takes everything remaining
      if (i === segments - 1) {
        chunks.push(text.substring(currentPos));
        break;
      }

      const rawEnd = currentPos + chunkSize;
      const splitPoint = findNaturalSplitPoint(text, rawEnd);
      chunks.push(text.substring(currentPos, splitPoint));
      currentPos = splitPoint;
    }

    return chunks;
  }

  // truncate text to a max length, keeping the end portion most relevant.
  // preserves the tail (most recent analysis) and trims the head.
  function truncateForPrompt(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return '...[earlier analysis truncated]...\n' + text.substring(text.length - maxLength);
  }

  // retry a function with exponential backoff for transient errors (429, 5xx, network).
  // onRetry(attempt, delay) is called before each retry wait so caller can update UI.
  async function retryWithBackoff(fn, maxRetries, signal, onRetry) {
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (signal && signal.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (err.name === 'AbortError') throw err;

        const errMsg = err.message || '';
        const isTransient = errMsg.includes('429')
          || errMsg.includes('500')
          || errMsg.includes('502')
          || errMsg.includes('503')
          || errMsg.includes('504')
          || errMsg.includes('Failed to fetch')
          || errMsg.includes('NetworkError');

        if (!isTransient || attempt >= maxRetries) throw err;

        // exponential backoff: 2s, 4s, 8s...
        const delay = Math.pow(2, attempt + 1) * 1000;
        if (onRetry) {
          onRetry(attempt + 1, delay);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  }

  // --- core request flow ---

  async function performRequest(prompt, loadingMsgId, contextData) {
    // create a fresh AbortController and keep a stable signal reference
    abortController = new AbortController();
    const signal = abortController.signal;

    updateProgress(loadingMsgId, t(currentLang, 'stage3'));

    try {
      // try the standard request first (full context)
      const response = await retryWithBackoff(
        () => attemptRequest(prompt, contextData, signal),
        2,
        signal,
        function(attempt, delay) {
          updateProgress(loadingMsgId,
            '[3/4] Transient error. Retry ' + attempt + '/2 in '
            + (delay / 1000) + 's...');
        }
      );

      requestTimer.stop();
      updateProgress(loadingMsgId, t(currentLang, 'stage4'));
      removeLoading(loadingMsgId);
      lastBotResponse = response;
      appendMessage('bot', response);
      var timingSummary = requestTimer.summary();
      if (timingSummary) {
        appendSystemMessage(t(currentLang, 'completed') + timingSummary);
      }
      toggleStopButton(false);
      abortController = null;

    } catch (error) {
      if (error.name === 'AbortError') {
        requestTimer.stop();
        removeLoading(loadingMsgId);
        toggleStopButton(false);
        abortController = null;
        return;
      }

      const errorString = error.message || error.toString();

      // check if context overflow -> enter split strategy.
      // the split log panel replaces the loading indicator and shows
      // detailed per-chunk progress so the user knows what is happening.
      if (isContextOverflowError(errorString) && contextData && contextData.length > 500) {
        updateProgress(loadingMsgId,
          '[3/4] Context overflow detected. Entering Binary Split Strategy...');

        try {
          const finalResponse = await processSplitStrategy(
            prompt, loadingMsgId, contextData, 2, signal, null
          );

          requestTimer.stop();
          removeLoading(loadingMsgId);
          lastBotResponse = finalResponse;
          appendMessage('bot', finalResponse);
          var splitTimeSummary = requestTimer.summary();
          if (splitTimeSummary) {
            appendSystemMessage('completed in ' + splitTimeSummary);
          }
          toggleStopButton(false);
          abortController = null;
          return;
        } catch (splitError) {
          requestTimer.stop();
          removeLoading(loadingMsgId);
          toggleStopButton(false);
          abortController = null;
          if (splitError.name !== 'AbortError') {
            appendErrorMessage("Analysis failed after splitting attempts: " + splitError.message);
          }
          return;
        }
      }

      // standard error handling
      requestTimer.stop();
      removeLoading(loadingMsgId);
      toggleStopButton(false);
      abortController = null;
      appendErrorMessage(error.message);
    }
  }

  // recursive split strategy (2 -> 4 -> 8 -> 16)
  // 1. splits context at natural boundaries
  // 2. processes each chunk with chained analysis
  // 3. guards against accumulated prompt overflow
  // 4. ends with a final synthesis step to merge all partial analyses
  //
  // splitLog (optional): a progress panel from createSplitLog().
  // if null, this function creates one. passed through on recursive escalation.
  async function processSplitStrategy(originalPrompt, loadingMsgId, fullContext, segments, signal, splitLog) {
    const MAX_SEGMENTS = 16;
    const MAX_ANALYSIS_IN_PROMPT = 6000;

    if (segments > MAX_SEGMENTS) {
      throw new Error(
        "Context too large even after splitting into " + MAX_SEGMENTS + " parts."
      );
    }

    // --- create or reuse the visual progress panel ---
    const totalKb = (fullContext.length / 1024).toFixed(1);
    if (!splitLog) {
      splitLog = createSplitLog(loadingMsgId, totalKb, segments);
    }

    // split at natural boundaries
    const chunks = splitIntoChunks(fullContext, segments);
    // total steps = actual chunks + 1 synthesis step
    var actualChunks = chunks.length;
    var totalSteps = actualChunks + 1;
    splitLog.setTotalSteps(totalSteps);

    const partialResults = [];
    let accumulatedAnalysis = '';

    for (let i = 0; i < chunks.length; i++) {
      if (signal && signal.aborted) {
        splitLog.dispose();
        throw new DOMException('Aborted', 'AbortError');
      }

      const chunk = chunks[i];
      if (!chunk || chunk.trim().length === 0) continue;

      var chunkKb = (chunk.length / 1024).toFixed(1);
      var chunkStart = Date.now();

      // update progress bar: fraction based on step index / total
      var stepFraction = i / totalSteps;
      splitLog.setProgress(stepFraction,
        'Part ' + (i + 1) + '/' + actualChunks
        + ' (' + chunkKb + ' KB) — sending to API...');

      // add log line for this chunk
      var activeLine = splitLog.addLine(
        '  ▶ Part ' + (i + 1) + '/' + actualChunks
        + ' (' + chunkKb + ' KB) — analyzing...', 'active');

      // build the prompt for this chunk
      let currentPrompt = originalPrompt;
      if (i > 0 && accumulatedAnalysis) {
        const trimmedAnalysis = truncateForPrompt(
          accumulatedAnalysis, MAX_ANALYSIS_IN_PROMPT
        );
        currentPrompt =
          '[Previous Part Analysis]:\n' + trimmedAnalysis
          + '\n\n[Current Question / User Input]:\n' + originalPrompt;
      }

      try {
        const result = await retryWithBackoff(
          () => attemptRequest(currentPrompt, chunk, signal),
          1,
          signal,
          function(attempt, delay) {
            splitLog.setProgress(stepFraction,
              'Part ' + (i + 1) + '/' + actualChunks
              + ' — retry ' + attempt + '/1 in '
              + (delay / 1000) + 's...');
            splitLog.updateLine(activeLine,
              '  ⟳ Part ' + (i + 1) + '/' + actualChunks
              + ' — retry ' + attempt + '/1 in '
              + (delay / 1000) + 's...');
          }
        );
        accumulatedAnalysis = result;
        partialResults.push(result);

        // record timing and update bar
        var chunkSec = (Date.now() - chunkStart) / 1000;
        splitLog.recordStep(chunkSec);
        var doneFraction = (i + 1) / totalSteps;
        splitLog.setProgress(doneFraction,
          'Part ' + (i + 1) + '/' + actualChunks + ' done');

        // update log line to done
        activeLine.classList.remove('active');
        activeLine.classList.add('done');
        splitLog.updateLine(activeLine,
          '  ✓ Part ' + (i + 1) + '/' + actualChunks
          + ' (' + chunkKb + ' KB) — ' + chunkSec.toFixed(1) + 's');

      } catch (err) {
        if (err.name === 'AbortError') {
          splitLog.dispose();
          throw err;
        }

        const errStr = err.message || err.toString();
        if (isContextOverflowError(errStr)) {
          var nextSegments = segments * 2;
          activeLine.classList.remove('active');
          activeLine.classList.add('warn');
          splitLog.updateLine(activeLine,
            '  ⚠ Part ' + (i + 1) + ' overflow → escalating to '
            + nextSegments + 'x split');
          splitLog.addLine(
            '  Re-splitting ' + totalKb + ' KB into '
            + nextSegments + ' parts...', 'warn');
          // reset progress for the new split level
          splitLog.setProgress(0,
            're-splitting into ' + nextSegments + ' parts...');
          return await processSplitStrategy(
            originalPrompt, loadingMsgId, fullContext, nextSegments, signal, splitLog
          );
        }
        splitLog.dispose();
        throw err;
      }
    }

    // safety check
    if (partialResults.length === 0) {
      splitLog.dispose();
      throw new Error('No content could be analyzed from split chunks.');
    }

    // single chunk: skip synthesis
    if (partialResults.length === 1) {
      splitLog.markComplete();
      splitLog.addLine('  ✓ Done  [' + splitLog.elapsed() + 's total]', 'done');
      return partialResults[0];
    }

    // --- synthesis step ---
    splitLog.setProgress(actualChunks / totalSteps,
      'Synthesizing ' + partialResults.length + ' partial results...');
    var synthLine = splitLog.addLine(
      '  ◆ Merging ' + partialResults.length
      + ' analyses into final response...', 'active');

    let partsSummary = '';
    for (let i = 0; i < partialResults.length; i++) {
      var partLimit = Math.max(2000, Math.floor(40000 / partialResults.length));
      const partText = truncateForPrompt(partialResults[i], partLimit);
      partsSummary += '--- Part ' + (i + 1) + ' ---\n' + partText + '\n\n';
    }

    const synthesisPrompt =
      'The following are partial analyses of different sections of the same webpage content.\n'
      + 'Please synthesize them into a single, coherent, comprehensive response.\n'
      + 'Remove redundancy, resolve any contradictions, and produce a unified answer.\n\n'
      + partsSummary
      + '[Original User Question]:\n' + originalPrompt;

    var synthStart = Date.now();

    try {
      const finalResult = await retryWithBackoff(
        () => attemptRequest(synthesisPrompt, null, signal),
        1,
        signal,
        function(attempt, delay) {
          splitLog.setProgress(actualChunks / totalSteps,
            'Synthesis retry ' + attempt + '/1 in '
            + (delay / 1000) + 's...');
          splitLog.updateLine(synthLine,
            '  ◆ Synthesis retry ' + attempt + '/1 in '
            + (delay / 1000) + 's...');
        }
      );
      var synthSec = (Date.now() - synthStart) / 1000;
      splitLog.recordStep(synthSec);
      synthLine.classList.remove('active');
      synthLine.classList.add('done');
      splitLog.updateLine(synthLine,
        '  ✓ Synthesis — ' + synthSec.toFixed(1) + 's');
      splitLog.markComplete();
      splitLog.addLine('  ✓ Done  [' + splitLog.elapsed() + 's total]', 'done');
      return finalResult;
    } catch (synthErr) {
      console.error('Synthesis step failed, returning last partial result:', synthErr);
      synthLine.classList.remove('active');
      synthLine.classList.add('warn');
      splitLog.updateLine(synthLine,
        '  ⚠ Synthesis failed — returning last partial result');
      splitLog.markPartial();
      return accumulatedAnalysis;
    }
  }

  // fill dynamic placeholders in the system prompt template
  function fillSystemPrompt(template, contextData, userQuery) {
    if (!template) {
      return "You are a helpful assistant.";
    }

    var now = new Date();
    var dateStr = now.getFullYear() + '-'
      + String(now.getMonth() + 1).padStart(2, '0') + '-'
      + String(now.getDate()).padStart(2, '0') + ' '
      + String(now.getHours()).padStart(2, '0') + ':'
      + String(now.getMinutes()).padStart(2, '0');
    var monthStr = now.getFullYear() + '-'
      + String(now.getMonth() + 1).padStart(2, '0');

    // extract page title from context header line "Title: ..."
    var pageTitle = 'N/A';
    if (contextData) {
      var titleMatch = contextData.match(/^Title:\s*(.+)$/m);
      if (titleMatch) {
        pageTitle = titleMatch[1].trim();
      }
    }

    // core content excerpt: first 500 chars of context
    var coreContent = 'no page context loaded';
    if (contextData) {
      coreContent = contextData.substring(0, 500);
      if (contextData.length > 500) {
        coreContent += '...';
      }
    }

    // previous user question
    var prevQuestion = lastBotResponse ? '(see conversation history)' : '无';

    var result = template;
    result = result.replace('【当前页面标题】', pageTitle);
    result = result.replace(/【当前页面核心文本[^】]*】/, coreContent);
    result = result.replace(/【当前页面时间戳[^】]*】/, monthStr);
    result = result.replace(/【当前页面发布[^】]*】/, monthStr);
    result = result.replace(/【用户前置问题[^】]*】/, prevQuestion);
    result = result.replace(/【当前操作时间[^】]*】/, dateStr);
    result = result.replace(
      /\{\{用户自定义任务[^}]*\}\}/,
      userQuery || 'analyze current page core info'
    );

    return result;
  }

  // build message array from prompt and optional page context.
  // the full page content goes into a dedicated user message so the model
  // always sees the complete text rather than just a 500-char excerpt.
  function buildMessages(prompt, contextData) {
    var systemTemplate = config.systemPrompt || '';
    // pass null for contextData so fillSystemPrompt only fills metadata
    // placeholders; the full content is injected separately below.
    var systemContent = fillSystemPrompt(systemTemplate, contextData, prompt);

    var messages = [];
    messages.push({ role: "system", content: systemContent });

    // inject the full page content as a separate context message so it sits
    // between the system prompt and the user query, giving the model the
    // clearest signal that it is reference material to read in full.
    if (contextData) {
      messages.push({
        role: "user",
        content: "[Page Content for Analysis - read in full]\n\n" + contextData
      });
    }

    messages.push({ role: "user", content: prompt });
    return messages;
  }

  // delegate to shared api-utils.js (loaded before popup.js)
  function buildPayload(messages) {
    return buildApiPayload(messages, config);
  }

  function extractResponseContent(data) {
    return extractApiResponse(data);
  }

  // perform a single API request and return the content string (or throw)
  async function attemptRequest(prompt, contextData, signal) {
      var url = constructApiUrl(config);
      var messages = buildMessages(prompt, contextData);
      var payload = buildPayload(messages);
      var headers = buildApiHeaders(config);

      var response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
        signal: signal
      });

      if (!response.ok) {
        var errorText = await response.text();
        throw new Error('API Error: ' + response.status + ' ' + errorText);
      }

      var data = await response.json();
      var content = extractResponseContent(data);

      if (!content) {
        console.error('Unrecognized response structure:', Object.keys(data));
        return "No response content.";
      }

      return content;
  }

  // safely update the loading/progress message in the chat panel
  function updateProgress(id, text) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = text;
      scrollToBottom();
    }
  }

  // --- split progress log helpers ---
  // create a persistent progress panel with a visual bar + step log.
  // returns an object with methods to update the bar and append log lines.
  function createSplitLog(parentId, totalKb, segments) {
    // hide the original loading indicator
    var parentEl = document.getElementById(parentId);
    if (parentEl) {
      parentEl.style.display = 'none';
    }

    // --- build DOM ---
    var logDiv = document.createElement('div');
    logDiv.classList.add('split-log');
    logDiv.id = 'split-log-' + Date.now();

    // header
    var header = document.createElement('div');
    header.classList.add('split-header');
    header.textContent = '── BINARY SPLIT ── ' + totalKb + ' KB → ' + segments + ' parts';
    logDiv.appendChild(header);

    // progress bar wrapper
    var progressWrap = document.createElement('div');
    progressWrap.classList.add('split-progress-wrap');

    var track = document.createElement('div');
    track.classList.add('split-progress-track');

    var fill = document.createElement('div');
    fill.classList.add('split-progress-fill');
    track.appendChild(fill);

    var pctLabel = document.createElement('div');
    pctLabel.classList.add('split-progress-pct');
    pctLabel.textContent = '0%';
    track.appendChild(pctLabel);

    progressWrap.appendChild(track);

    // status row (step description + time)
    var statusRow = document.createElement('div');
    statusRow.classList.add('split-progress-status');

    var stepSpan = document.createElement('span');
    stepSpan.classList.add('split-progress-step');
    stepSpan.textContent = 'preparing...';
    statusRow.appendChild(stepSpan);

    var timeSpan = document.createElement('span');
    timeSpan.classList.add('split-progress-time');
    timeSpan.textContent = '0.0s';
    statusRow.appendChild(timeSpan);

    progressWrap.appendChild(statusRow);
    logDiv.appendChild(progressWrap);

    // step log container (below the bar)
    var stepsDiv = document.createElement('div');
    stepsDiv.classList.add('split-steps');
    logDiv.appendChild(stepsDiv);

    chatDisplay.appendChild(logDiv);
    scrollToBottom();

    // --- internal state ---
    var processStart = Date.now();
    // total steps = chunks + 1 (synthesis). updated when we know the real count.
    var totalSteps = segments + 1;
    var completedSteps = 0;
    // track per-step durations for ETA
    var stepDurations = [];

    // timer that updates elapsed + ETA every second
    var timerHandle = setInterval(function() {
      var elapsedSec = (Date.now() - processStart) / 1000;
      var etaText = '';
      if (stepDurations.length > 0 && completedSteps < totalSteps) {
        var avgSec = 0;
        for (var d = 0; d < stepDurations.length; d++) {
          avgSec += stepDurations[d];
        }
        avgSec = avgSec / stepDurations.length;
        var remaining = (totalSteps - completedSteps) * avgSec;
        etaText = '  ~' + remaining.toFixed(0) + 's left';
      }
      timeSpan.textContent = elapsedSec.toFixed(1) + 's' + etaText;
    }, 1000);

    return {
      id: logDiv.id,

      // update the total number of steps (called on escalation)
      setTotalSteps: function(n) {
        totalSteps = n;
      },

      // set progress (0..1) with step description.
      // uses scaleX transform (GPU compositable) instead of width.
      setProgress: function(fraction, description) {
        var clamped = Math.min(1, Math.max(0, fraction));
        var pct = Math.round(clamped * 100);
        fill.style.transform = 'scaleX(' + clamped + ')';
        pctLabel.textContent = pct + '%';
        if (description) {
          stepSpan.textContent = description;
        }
        scrollToBottom();
      },

      // record a completed step duration (seconds) for ETA calculation
      recordStep: function(durationSec) {
        completedSteps++;
        stepDurations.push(durationSec);
      },

      // mark the bar as fully complete
      markComplete: function() {
        fill.style.transform = 'scaleX(1)';
        fill.classList.add('complete');
        pctLabel.textContent = '100%';
        var totalSec = ((Date.now() - processStart) / 1000).toFixed(1);
        stepSpan.textContent = 'complete';
        timeSpan.textContent = 'total: ' + totalSec + 's';
        clearInterval(timerHandle);
      },

      // mark partial completion (e.g. synthesis failed)
      markPartial: function() {
        var totalSec = ((Date.now() - processStart) / 1000).toFixed(1);
        stepSpan.textContent = 'partial (synthesis failed)';
        timeSpan.textContent = 'total: ' + totalSec + 's';
        clearInterval(timerHandle);
      },

      // append a log line below the bar
      addLine: function(text, cssClass) {
        var line = document.createElement('div');
        line.classList.add('split-line');
        if (cssClass) {
          line.classList.add(cssClass);
        }
        line.textContent = text;
        stepsDiv.appendChild(line);
        scrollToBottom();
        return line;
      },

      // update text of an existing log line
      updateLine: function(lineEl, text) {
        if (lineEl) {
          lineEl.textContent = text;
          scrollToBottom();
        }
      },

      // get elapsed seconds since process started
      elapsed: function() {
        return ((Date.now() - processStart) / 1000).toFixed(1);
      },

      // clean up the timer (call on abort or completion)
      dispose: function() {
        clearInterval(timerHandle);
      },

      // remove the log panel entirely
      remove: function() {
        clearInterval(timerHandle);
        if (logDiv.parentNode) {
          logDiv.parentNode.removeChild(logDiv);
        }
        if (parentEl) {
          parentEl.style.display = '';
        }
      }
    };
  }

  function removeLoading(id) {
      const el = document.getElementById(id);
      if (el) el.remove();
  }

  function toggleStopButton(show) {
    if (show) {
      sendBtn.disabled = true;
      stopBtn.disabled = false;
      refreshBtn.disabled = true;
      setStatusLive();
    } else {
      sendBtn.disabled = false;
      stopBtn.disabled = true;
      refreshBtn.disabled = false;
      setStatusDone();
    }
  }

  function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    
    if (role === 'user') {
      msgDiv.classList.add('user-message');
    } else {
      msgDiv.classList.add('bot-message');
    }
    
    // Create content container
    const contentDiv = document.createElement('div');
    contentDiv.style.whiteSpace = 'pre-wrap';

    // Process custom formatting tags if present
    if (role === 'bot') {
        // Replace <root_cause>...</root_cause> with highlighted span
        // Note: This is a simple regex replacement. Be careful with nested tags or XSS if text was not trusted (but here it's from LLM).
        // We use a temporary replacement to avoid XSS, then textContent, then restore html.
        // A safer way for simple highlighting:
        
        // 1. Escape HTML chars first to prevent injection
        let safeText = escapeHtml(text);

        // 2. Restore our specific tag for styling
        // We look for the escaped version of <root_cause>
        safeText = safeText.replace(/&lt;root_cause&gt;([\s\S]*?)&lt;\/root_cause&gt;/g, '<span class="root-cause-highlight">$1</span>');

        contentDiv.innerHTML = safeText;
    } else {
        contentDiv.textContent = text;
    }

    msgDiv.appendChild(contentDiv);

    // Add copy button for bot messages
    if (role === 'bot') {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = t(currentLang, 'copy');
      copyBtn.title = 'Copy to clipboard';
      copyBtn.onclick = function() {
        navigator.clipboard.writeText(text).then(function() {
          copyBtn.textContent = t(currentLang, 'copied');
          setTimeout(function() { copyBtn.textContent = t(currentLang, 'copy'); }, 2000);
        }, function(err) {
          console.error('Could not copy text: ', err);
        });
      };
      msgDiv.appendChild(copyBtn);
    }

    chatDisplay.appendChild(msgDiv);
    scrollToBottom();
  }

  function appendSystemMessage(text) {
    const id = 'sys-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.id = id;
    msgDiv.classList.add('system-msg');
    msgDiv.textContent = text;
    chatDisplay.appendChild(msgDiv);
    scrollToBottom();
    return id;
  }

  function appendErrorMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('error-message');
    msgDiv.textContent = text;
    chatDisplay.appendChild(msgDiv);
    scrollToBottom();
  }

  // batch scroll-to-bottom via rAF to avoid forced reflow storms.
  // multiple calls within the same frame are collapsed into one layout read.
  var _scrollRafId = 0;
  function scrollToBottom() {
    if (_scrollRafId) return; // already scheduled
    _scrollRafId = requestAnimationFrame(function() {
      _scrollRafId = 0;
      chatDisplay.scrollTop = chatDisplay.scrollHeight;
    });
  }
});
