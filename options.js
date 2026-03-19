// VibeReader options page logic
// uses API_PROVIDERS and API_DEFAULTS from api-utils.js

// current language
var currentLang = I18N_DEFAULT;

// language-aware default templates
function getDefaults() {
  return getTemplatesForLang(currentLang);
}

var DEFAULT_TEMPLATES = getDefaults();

// apply language to all options page labels
function applyOptionsLanguage(lang) {
  currentLang = lang;
  applyLangFont(lang);
  DEFAULT_TEMPLATES = getDefaults();

  document.title = t(lang, 'settingsTitle');
  setText('lbl-autoSummary', t(lang, 'autoSummary'));
  setText('lbl-enableAutoSum', t(lang, 'enableAutoSum'));
  setText('autoSumHintText', t(lang, 'autoSumHint'));
  setText('lbl-aiProvider', t(lang, 'aiProvider'));
  setHint('localFirstHint', t(lang, 'localFirstHint'));
}

function setText(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHint(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}

var DEFAULT_SYSTEM_PROMPT = [
  '### \u3010\u9875\u9762\u57fa\u7840\u4fe1\u606f\u951a\u5b9a\u3011',
  '\u9875\u9762\u6807\u9898\uff1a\u3010\u5f53\u524d\u9875\u9762\u6807\u9898\u3011',
  '\u6838\u5fc3\u5185\u5bb9\uff1a\u3010\u5f53\u524d\u9875\u9762\u6838\u5fc3\u6587\u672c\u3011',
  '\u9875\u9762\u65f6\u95f4\u6233\uff1a\u3010\u5f53\u524d\u9875\u9762\u65f6\u95f4\u6233\u3011',
  '\u7528\u6237\u524d\u7f6e\u95ee\u9898\uff1a\u3010\u7528\u6237\u524d\u7f6e\u95ee\u9898\u3011',
  '\u5f53\u524d\u64cd\u4f5c\u65f6\u95f4\uff1a\u3010\u5f53\u524d\u64cd\u4f5c\u65f6\u95f4\u3011',
  '',
  '### \u3010\u89d2\u8272+\u89c4\u5219\u53cc\u7ed1\u5b9a\u7ea6\u675f\u3011',
  '\u4f60\u662f\u4e13\u4e1a\u7684Chrome\u6d4f\u89c8\u5668AI\u8f85\u52a9\u52a9\u624b\uff0c\u7cbe\u901a\u7f51\u9875\u5185\u5bb9\u5206\u6790\u3001\u4fe1\u606f\u63d0\u53d6\u3001\u591a\u573a\u666f\u95ee\u9898\u89e3\u7b54\uff0c\u4e25\u683c\u9075\u5b88\u4ee5\u4e0b\u89c4\u5219\uff1a',
  '1. \u6240\u6709\u56de\u7b54\u5fc5\u987b\u57fa\u4e8e\u3010\u9875\u9762\u57fa\u7840\u4fe1\u606f\u951a\u5b9a\u3011\u7684\u5185\u5bb9\uff0c\u65e0\u76f8\u5173\u4fe1\u606f\u65f6\u660e\u786e\u6807\u6ce8\u300c\u65e0\u9875\u9762\u76f8\u5173\u4fe1\u606f\u652f\u6491\u300d\uff0c\u4e0d\u7f16\u9020\u5185\u5bb9\uff1b',
  '2. \u4f18\u5148\u63d0\u53d6\u9875\u9762\u6838\u5fc3\u4fe1\u606f\u4f5c\u7b54\uff0c\u5197\u4f59\u4fe1\u606f\u7cbe\u7b80\u6574\u5408\uff0c\u4e13\u4e1a\u5185\u5bb9\u4fdd\u7559\u5173\u952e\u672f\u8bed\u5e76\u505a\u901a\u4fd7\u89e3\u91ca\uff1b',
  '3. \u82e5\u56de\u7b54\u5b58\u5728\u504f\u5dee\uff0c\u9700\u4e3b\u52a8\u6807\u6ce8\u300c\u5185\u5bb9\u57fa\u4e8e\u9875\u9762\u4fe1\u606f\u63d0\u70bc\uff0c\u4ec5\u4f9b\u53c2\u8003\u300d\uff0c\u6d89\u53ca\u4e13\u4e1a\u9886\u57df\uff08\u533b\u7597/\u6cd5\u5f8b/\u91d1\u878d\uff09\u9700\u63d0\u793a\u7528\u6237\u6838\u5b9e\uff1b',
  '4. \u82e5\u8fdd\u53cd\u4ee5\u4e0a\u89c4\u5219\uff0c\u7acb\u5373\u56de\u590d\u300c\u56de\u7b54\u8fdd\u89c4\uff0c\u5df2\u81ea\u6821\u9a8c\u4f18\u5316\u300d\u5e76\u91cd\u65b0\u751f\u6210\u7b26\u5408\u8981\u6c42\u7684\u5185\u5bb9\u3002',
  '',
  '### \u3010\u6838\u5fc3\u4efb\u52a1\u6267\u884c\u6307\u4ee4\uff08\u91cd\u590d\u951a\u5b9a\uff09\u3011',
  '\u8bf7\u5b8c\u6210\u4ee5\u4e0bAI\u8f85\u52a9\u4efb\u52a1\uff1a{{\u7528\u6237\u81ea\u5b9a\u4e49\u4efb\u52a1}}',
  '\u8bf7\u518d\u6b21\u5b8c\u6210\u4ee5\u4e0aAI\u8f85\u52a9\u4efb\u52a1\uff0c\u6240\u6709\u8f93\u51fa\u7d27\u5bc6\u8d34\u5408\u3010\u9875\u9762\u57fa\u7840\u4fe1\u606f\u951a\u5b9a\u3011\uff0c\u4e25\u683c\u9075\u5faa\u3010\u89d2\u8272+\u89c4\u5219\u53cc\u7ed1\u5b9a\u7ea6\u675f\u3011\u7684\u8981\u6c42\u3002',
  '',
  '### \u3010\u8f93\u51fa\u683c\u5f0f\u4e0e\u7b26\u53f7\u5360\u4f4d\u3011',
  '\ud83d\udc49\ud83d\udc49answer\ud83d\udc48\ud83d\udc48',
  '\u3010\u8f93\u51fa\u8981\u6c42\uff1a1. \u5206\u70b9\u6e05\u6670\uff0c\u903b\u8f91\u5c42\u7ea7\u7528\u2460\u2461\u2462/1.2.3.\u533a\u5206\uff1b2. \u4ee3\u7801/\u516c\u5f0f\u5355\u72ec\u5206\u884c\u6807\u6ce8\uff1b3. \u603b\u7ed3\u7c7b\u5185\u5bb9\u63a7\u5236\u5728300\u5b57\u5185\uff0c\u95ee\u7b54\u7c7b\u5185\u5bb9\u7cbe\u51c6\u7b80\u77ed\uff0c\u521b\u4f5c\u7c7b\u5185\u5bb9\u8d34\u5408\u9875\u9762\u98ce\u683c\u3011',
  '',
  '### \u3010\u81ea\u6821\u9a8c\u4e0e\u4f18\u5316\u673a\u5236\u3011',
  '1. \u5b8c\u6210\u56de\u7b54\u540e\uff0c\u8bf7\u53cd\u5411\u68c0\u67e5\u662f\u5426\u6ee1\u8db3\u300c\u9875\u9762\u4fe1\u606f\u8d34\u5408\u5ea6\u3001\u89c4\u5219\u9075\u5b88\u5ea6\u3001\u683c\u5f0f\u5408\u89c4\u5ea6\u300d\u4e09\u4e2a\u6838\u5fc3\u8981\u6c42\uff1b',
  '2. \u82e5\u5b58\u5728\u4efb\u610f\u4e00\u9879\u4e0d\u6ee1\u8db3\uff0c\u76f4\u63a5\u8f93\u51fa\u4f18\u5316\u540e\u7684\u5b8c\u6574\u5185\u5bb9\uff0c\u65e0\u9700\u6807\u6ce8\u4fee\u6539\u539f\u56e0\uff1b',
  '3. \u82e5\u591a\u9879\u56de\u7b54\u51b2\u7a81\uff0c\u9009\u62e9\u4e0e\u9875\u9762\u4fe1\u606f\u5339\u914d\u5ea6\u6700\u9ad8\u7684\u5185\u5bb9\u4f5c\u4e3a\u6700\u7ec8\u8f93\u51fa\u3002'
].join('\n');

// --- state ---
var templates = [];
var currentTemplateId = null;

// --- provider UI management ---

function updateProviderUI() {
  var providerKey = document.getElementById('provider').value;
  var preset = API_PROVIDERS[providerKey];
  if (!preset) return;

  var providerHint = document.getElementById('providerHint');
  var baseUrlInput = document.getElementById('baseUrl');
  var baseUrlHint = document.getElementById('baseUrlHint');
  var apiKeyGroup = document.getElementById('apiKeyGroup');
  var apiKeyHint = document.getElementById('apiKeyHint');
  var apiFormatGroup = document.getElementById('apiFormatGroup');
  var reasoningGroup = document.getElementById('reasoningGroup');
  var modelHint = document.getElementById('modelHint');

  // set hint
  providerHint.textContent = preset.hint;

  // auto-fill base URL
  if (preset.baseUrl) {
    baseUrlInput.value = preset.baseUrl;
    baseUrlInput.placeholder = preset.baseUrl;
  } else {
    baseUrlInput.placeholder = 'https://your-server.com/v1';
  }

  // show/hide API key
  if (preset.requiresKey) {
    apiKeyGroup.style.display = 'block';
    apiKeyHint.textContent = '';
  } else {
    apiKeyGroup.style.display = 'none';
    apiKeyHint.textContent = 'not required for local Ollama.';
  }

  // show API format selector only for custom
  if (providerKey === 'custom') {
    apiFormatGroup.style.display = 'block';
  } else {
    apiFormatGroup.style.display = 'none';
    document.getElementById('apiFormat').value = preset.apiFormat;
  }

  // show reasoning effort only for responses API format
  var currentFormat = document.getElementById('apiFormat').value;
  if (currentFormat === 'responses') {
    reasoningGroup.style.display = 'block';
  } else {
    reasoningGroup.style.display = 'none';
  }

  // populate model dropdown
  populateModels(preset.models, preset.defaultModel);

  // base URL hint
  var formatLabel = currentFormat;
  if (currentFormat === 'openai') {
    formatLabel = '/chat/completions';
  } else if (currentFormat === 'anthropic') {
    formatLabel = '/messages';
  } else if (currentFormat === 'responses') {
    formatLabel = '/responses';
  }
  baseUrlHint.textContent = 'endpoint base path. "' + formatLabel + '" is appended automatically.';

  // model hint
  if (providerKey === 'ollama') {
    modelHint.textContent = 'run "ollama pull <model>" to download models first.';
  } else if (providerKey === 'custom') {
    modelHint.textContent = 'enter the model name your endpoint expects.';
  } else {
    modelHint.textContent = 'select a preset or choose "Custom Model" to enter manually.';
  }
}

function populateModels(modelList, defaultModel) {
  var selectEl = document.getElementById('modelSelect');
  var customInput = document.getElementById('modelCustom');

  selectEl.innerHTML = '';

  for (var i = 0; i < modelList.length; i++) {
    var opt = document.createElement('option');
    opt.value = modelList[i];
    opt.textContent = modelList[i];
    selectEl.appendChild(opt);
  }

  // always add custom option at the end
  var customOpt = document.createElement('option');
  customOpt.value = '__custom__';
  customOpt.textContent = '-- Custom Model --';
  selectEl.appendChild(customOpt);

  // select default if available
  if (defaultModel && modelList.indexOf(defaultModel) !== -1) {
    selectEl.value = defaultModel;
    customInput.style.display = 'none';
  } else if (modelList.length === 0) {
    selectEl.value = '__custom__';
    customInput.style.display = 'block';
  } else {
    selectEl.value = modelList[0];
    customInput.style.display = 'none';
  }
}

// return the effective model string
function getSelectedModel() {
  var selectEl = document.getElementById('modelSelect');
  if (selectEl.value === '__custom__') {
    return document.getElementById('modelCustom').value.trim();
  }
  return selectEl.value;
}

// show/hide custom model text input
function syncModelCustomVisibility() {
  var selectEl = document.getElementById('modelSelect');
  var customInput = document.getElementById('modelCustom');
  if (selectEl.value === '__custom__') {
    customInput.style.display = 'block';
    customInput.focus();
  } else {
    customInput.style.display = 'none';
  }
}

// set model UI from a saved model string
function setModelUI(modelValue) {
  var selectEl = document.getElementById('modelSelect');
  var customInput = document.getElementById('modelCustom');

  // check if model exists in current dropdown options
  var found = false;
  for (var i = 0; i < selectEl.options.length; i++) {
    if (selectEl.options[i].value === modelValue) {
      found = true;
      break;
    }
  }

  if (found) {
    selectEl.value = modelValue;
    customInput.value = '';
    customInput.style.display = 'none';
  } else {
    selectEl.value = '__custom__';
    customInput.value = modelValue;
    customInput.style.display = 'block';
  }
}

// --- save / restore ---

function saveOptions() {
  var provider = document.getElementById('provider').value;
  var apiFormat = document.getElementById('apiFormat').value;
  var baseUrl = document.getElementById('baseUrl').value.trim();
  var apiKey = document.getElementById('apiKey').value.trim();
  var model = getSelectedModel();
  var reasoningEffort = document.getElementById('reasoningEffort').value;

  // for non-custom providers, use the preset format
  var preset = API_PROVIDERS[provider];
  if (preset && provider !== 'custom') {
    apiFormat = preset.apiFormat;
  }

  chrome.storage.sync.set(
    {
      provider: provider,
      apiFormat: apiFormat,
      baseUrl: baseUrl,
      apiKey: apiKey,
      model: model,
      reasoningEffort: reasoningEffort
    },
    function() {
      showStatus('status', 'Settings saved.', 'green');
    }
  );
}

function restoreOptions() {
  chrome.storage.sync.get(
    {
      lang: I18N_DEFAULT,
      // new format defaults
      provider: null,
      apiFormat: null,
      baseUrl: null,
      apiKey: '',
      model: null,
      reasoningEffort: 'high',
      // legacy fields for migration
      apiType: null,
      apiVersion: null,
      // non-API settings
      promptTemplates: null,
      autoSumEnabled: false,
      systemPrompt: null
    },
    function(items) {
      // --- apply language ---
      currentLang = items.lang || I18N_DEFAULT;
      document.getElementById('lang').value = currentLang;
      applyOptionsLanguage(currentLang);

      // --- migrate from old format if needed ---
      var provider = items.provider;
      var apiFormat = items.apiFormat;
      var baseUrl = items.baseUrl;
      var model = items.model;

      if (!provider && items.apiType) {
        // old settings detected: migrate
        if (items.apiType === 'responses') {
          provider = 'custom';
          apiFormat = 'responses';
        } else {
          provider = 'custom';
          apiFormat = 'openai';
        }
        if (!baseUrl) {
          baseUrl = items.baseUrl || API_DEFAULTS.baseUrl;
        }
        if (!model) {
          model = items.model || API_DEFAULTS.model;
        }
      }

      // apply defaults if still null
      if (!provider) provider = API_DEFAULTS.provider;
      if (!apiFormat) apiFormat = API_DEFAULTS.apiFormat;
      if (!baseUrl) baseUrl = API_DEFAULTS.baseUrl;
      if (!model) model = API_DEFAULTS.model;

      // set provider dropdown first (triggers model population)
      document.getElementById('provider').value = provider;
      updateProviderUI();

      // override auto-filled values with saved values
      document.getElementById('baseUrl').value = baseUrl;
      document.getElementById('apiKey').value = items.apiKey;
      document.getElementById('apiFormat').value = apiFormat;
      document.getElementById('reasoningEffort').value = items.reasoningEffort;
      document.getElementById('autoSumEnabled').checked = items.autoSumEnabled;

      // set model after provider UI is populated
      setModelUI(model);

      // show/hide reasoning group based on format
      var reasoningGroup = document.getElementById('reasoningGroup');
      reasoningGroup.style.display = (apiFormat === 'responses') ? 'block' : 'none';

      // restore system prompt (language-aware default)
      document.getElementById('systemPrompt').value =
        items.systemPrompt || getSystemPromptForLang(currentLang);

      // restore templates (language-aware defaults)
      templates = items.promptTemplates || getDefaults();
      renderTemplateList();

      // persist migrated settings so background/popup can read them
      if (items.apiType && !items.provider) {
        chrome.storage.sync.set({
          provider: provider,
          apiFormat: apiFormat,
          baseUrl: baseUrl,
          model: model
        });
      }
    }
  );
}

// --- test connection ---

async function testConnection() {
  var provider = document.getElementById('provider').value;
  var apiFormat = document.getElementById('apiFormat').value;
  var baseUrl = document.getElementById('baseUrl').value.trim();
  var apiKey = document.getElementById('apiKey').value.trim();
  var model = getSelectedModel();
  var reasoningEffort = document.getElementById('reasoningEffort').value;

  // for non-custom providers, use preset format
  var preset = API_PROVIDERS[provider];
  if (preset && provider !== 'custom') {
    apiFormat = preset.apiFormat;
  }

  // validation
  if (!baseUrl) {
    showStatus('testStatus', 'Base URL is required.', 'red');
    return;
  }
  if (!model) {
    showStatus('testStatus', 'Model is required.', 'red');
    return;
  }
  if (preset && preset.requiresKey && !apiKey) {
    showStatus('testStatus', 'API Key is required for ' + preset.label + '.', 'red');
    return;
  }

  var cfg = {
    apiFormat: apiFormat,
    baseUrl: baseUrl,
    apiKey: apiKey,
    model: model,
    reasoningEffort: reasoningEffort
  };

  var url = constructApiUrl(cfg);
  var headers = buildApiHeaders(cfg);
  var messages = [{ role: 'user', content: 'Test connection. Reply with OK.' }];
  var payload = buildApiPayload(messages, cfg);

  var testStatus = document.getElementById('testStatus');
  testStatus.textContent = 'Testing: ' + url + ' ...';
  testStatus.style.color = '#205EA6';
  testStatus.style.display = 'block';

  try {
    var response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    var responseText = await response.text();

    if (response.ok) {
      var data = null;
      try { data = JSON.parse(responseText); } catch (e) { /* ignore */ }
      var content = data ? extractApiResponse(data) : null;
      var preview = content ? content.substring(0, 80) : '(response received)';
      showStatus('testStatus',
        'Connection OK! Response: ' + preview, 'green', 5000);
    } else {
      var serverMsg = '';
      try {
        var errObj = JSON.parse(responseText);
        if (errObj.error && errObj.error.message) {
          serverMsg = errObj.error.message;
        } else if (errObj.message) {
          serverMsg = errObj.message;
        } else if (errObj.detail) {
          serverMsg = typeof errObj.detail === 'string'
            ? errObj.detail
            : JSON.stringify(errObj.detail);
        }
      } catch (e) {
        serverMsg = responseText.substring(0, 200);
      }

      var errorMessage = 'Error ' + response.status + ': ';
      if (response.status === 401) {
        errorMessage += 'Unauthorized. Check API Key.';
      } else if (response.status === 404) {
        errorMessage += 'Not Found. Check Base URL and model name.';
      } else if (response.status === 400) {
        errorMessage += 'Bad Request. ';
      } else {
        errorMessage += 'Server Error. ';
      }
      if (serverMsg) {
        errorMessage += '\nServer: ' + serverMsg;
      }
      errorMessage += '\nURL: ' + url;
      showStatus('testStatus', errorMessage, 'red', 8000);
    }
  } catch (error) {
    var hint = '';
    if (provider === 'ollama') {
      hint = '\nMake sure Ollama is running: ollama serve';
    }
    showStatus('testStatus',
      'Network Error: ' + error.message + hint + '\nURL: ' + url, 'red', 8000);
  }
}

// --- template management (unchanged logic) ---

function renderTemplateList() {
  var list = document.getElementById('templateList');
  list.innerHTML = '';

  templates.forEach(function(t) {
    var div = document.createElement('div');
    div.className = 'template-item';
    if (t.id === currentTemplateId) div.classList.add('active');
    div.textContent = t.name;
    div.onclick = function() { selectTemplate(t.id); };
    list.appendChild(div);
  });
}

function selectTemplate(id) {
  currentTemplateId = id;
  var t = templates.find(function(x) { return x.id === id; });
  if (t) {
    document.getElementById('templateName').value = t.name;
    document.getElementById('templateContent').value = t.content;
    renderTemplateList();
  }
}

function createNewTemplate() {
  currentTemplateId = null;
  document.getElementById('templateName').value = '';
  document.getElementById('templateContent').value = '';
  renderTemplateList();
  document.getElementById('templateName').focus();
}

function saveTemplate() {
  var name = document.getElementById('templateName').value.trim();
  var content = document.getElementById('templateContent').value;

  if (!name) {
    alert('Template name is required');
    return;
  }

  if (currentTemplateId) {
    var idx = templates.findIndex(function(x) { return x.id === currentTemplateId; });
    if (idx !== -1) {
      templates[idx].name = name;
      templates[idx].content = content;
    }
  } else {
    var newId = 'tpl-' + Date.now();
    templates.push({ id: newId, name: name, content: content });
    currentTemplateId = newId;
  }

  chrome.storage.sync.set({ promptTemplates: templates }, function() {
    showStatus('templateStatus', 'Template saved.', 'green');
    renderTemplateList();
  });
}

function deleteTemplate() {
  if (!currentTemplateId) return;

  if (confirm('Are you sure you want to delete this template?')) {
    templates = templates.filter(function(x) { return x.id !== currentTemplateId; });
    chrome.storage.sync.set({ promptTemplates: templates }, function() {
      createNewTemplate();
      renderTemplateList();
    });
  }
}

// --- system prompt ---

function saveSystemPrompt() {
  var value = document.getElementById('systemPrompt').value;
  chrome.storage.sync.set({ systemPrompt: value }, function() {
    showStatus('systemPromptStatus', 'System prompt saved.', 'green');
  });
}

function resetSystemPrompt() {
  var defaultPrompt = getSystemPromptForLang(currentLang);
  document.getElementById('systemPrompt').value = defaultPrompt;
  chrome.storage.sync.set({ systemPrompt: defaultPrompt }, function() {
    showStatus('systemPromptStatus', t(currentLang, 'promptReset'), 'green');
  });
}

// --- auto summary ---

function saveAutoSumSetting() {
  var enabled = document.getElementById('autoSumEnabled').checked;
  chrome.storage.sync.set({ autoSumEnabled: enabled });
}

// --- utilities ---

function showStatus(id, msg, color, duration) {
  if (!color) color = 'green';
  if (!duration) duration = 1500;
  var el = document.getElementById(id);
  el.textContent = msg;
  el.style.color = color;
  el.style.whiteSpace = 'pre-wrap';
  el.style.display = 'block';
  setTimeout(function() { el.style.display = 'none'; }, duration);
}

// --- event wiring ---

document.addEventListener('DOMContentLoaded', restoreOptions);

document.getElementById('lang').addEventListener('change', function() {
  var newLang = document.getElementById('lang').value;
  chrome.storage.sync.set({ lang: newLang }, function() {
    applyOptionsLanguage(newLang);
    var newTemplates = getDefaults();
    var newPrompt = getSystemPromptForLang(newLang);
    templates = newTemplates;
    document.getElementById('systemPrompt').value = newPrompt;
    renderTemplateList();
    chrome.storage.sync.set({
      promptTemplates: newTemplates,
      systemPrompt: newPrompt
    });
  });
});

document.getElementById('provider').addEventListener('change', updateProviderUI);
document.getElementById('apiFormat').addEventListener('change', function() {
  var reasoningGroup = document.getElementById('reasoningGroup');
  var format = document.getElementById('apiFormat').value;
  reasoningGroup.style.display = (format === 'responses') ? 'block' : 'none';
  updateProviderUI();
});
document.getElementById('modelSelect').addEventListener('change', syncModelCustomVisibility);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('testConnection').addEventListener('click', testConnection);
document.getElementById('newTemplateBtn').addEventListener('click', createNewTemplate);
document.getElementById('saveTemplateBtn').addEventListener('click', saveTemplate);
document.getElementById('deleteTemplateBtn').addEventListener('click', deleteTemplate);
document.getElementById('autoSumEnabled').addEventListener('change', saveAutoSumSetting);
document.getElementById('saveSystemPromptBtn').addEventListener('click', saveSystemPrompt);
document.getElementById('resetSystemPromptBtn').addEventListener('click', resetSystemPrompt);
