// auto summary - injected content script module
// creates and manages the left-side auto-summary sidebar
// flow: page load → collapsed bar (loading) → flash once when ready
//       → user clicks to expand → collapse again = no more flash

(function() {
  // prevent duplicate injection
  if (window.__autosumInjected) return;
  window.__autosumInjected = true;

  var sidebar = null;
  var isCollapsed = true;
  var currentSummary = '';
  var isLoading = false;
  var hasBeenRead = false;

  // inline i18n for autosum (cannot import external modules in content scripts)
  var _lang = 'en';
  var _strings = {
    en: { label: 'SUM', header: 'AUTO SUMMARY', awaiting: 'awaiting...', analyzing: 'analyzing page...', retry: 'RETRY', ready: 'READY', err: 'ERR', loading: '...' },
    ja: { label: '\u8981\u7d04', header: '\u81ea\u52d5\u8981\u7d04', awaiting: '\u5f85\u6a5f\u4e2d...', analyzing: '\u30da\u30fc\u30b8\u5206\u6790\u4e2d...', retry: '\u30ea\u30c8\u30e9\u30a4', ready: '\u5b8c\u4e86', err: '\u30a8\u30e9\u30fc', loading: '...' },
    zh: { label: '\u6458\u8981', header: '\u81ea\u52a8\u6458\u8981', awaiting: '\u7b49\u5f85\u4e2d...', analyzing: '\u6b63\u5728\u5206\u6790\u9875\u9762...', retry: '\u91cd\u8bd5', ready: '\u5c31\u7eea', err: '\u9519\u8bef', loading: '...' }
  };
  function _t(key) {
    var s = _strings[_lang] || _strings['en'];
    return s[key] || _strings['en'][key] || key;
  }

  // create sidebar DOM
  function createSidebar() {
    if (sidebar) return sidebar;

    sidebar = document.createElement('div');
    sidebar.id = 'chrome-autosum-sidebar';
    // start collapsed: thin bar on the left
    sidebar.className = 'collapsed';
    sidebar.innerHTML = [
      '<div class="autosum-bar-label">\u25b6 ' + _t('label') + '</div>',
      '<div class="autosum-header">',
      '  <button class="autosum-toggle-btn" title="collapse">\u25c0</button>',
      '  <span class="autosum-header-title">' + _t('header') + '</span>',
      '</div>',
      '<div class="autosum-content">',
      '  <div class="autosum-status">' + _t('awaiting') + '</div>',
      '</div>',
      '<div class="autosum-footer">',
      '  <button class="autosum-retry-btn" title="retry">' + _t('retry') + '</button>',
      '</div>'
    ].join('\n');

    // inject CSS
    injectStyles();

    // event listeners
    var barLabel = sidebar.querySelector('.autosum-bar-label');
    var toggleBtn = sidebar.querySelector('.autosum-toggle-btn');
    var retryBtn = sidebar.querySelector('.autosum-retry-btn');

    barLabel.addEventListener('click', expandPanel);
    toggleBtn.addEventListener('click', collapsePanel);
    retryBtn.addEventListener('click', requestRetry);

    document.body.appendChild(sidebar);
    return sidebar;
  }

  // inject CSS stylesheet
  function injectStyles() {
    if (document.getElementById('chrome-autosum-styles')) return;

    var link = document.createElement('link');
    link.id = 'chrome-autosum-styles';
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('autosum.css');
    document.head.appendChild(link);
  }

  // expand the panel (user clicked bar or expand)
  function expandPanel() {
    if (!sidebar) return;
    isCollapsed = false;
    sidebar.classList.remove('collapsed');

    // user has now seen the summary: mark as read
    if (currentSummary) {
      hasBeenRead = true;
    }
    // stop flash and unread glow
    sidebar.classList.remove('flash-once');
    sidebar.classList.remove('unread');
  }

  // collapse the panel back to thin bar
  function collapsePanel() {
    if (!sidebar) return;
    isCollapsed = true;
    sidebar.classList.add('collapsed');

    // if user already read, no more flash/unread indicators
    // flash-once and unread were already removed in expandPanel()
  }

  // show loading state
  function showLoading() {
    if (!sidebar) createSidebar();
    isLoading = true;
    hasBeenRead = false;
    currentSummary = '';

    // remove any previous ready indicators
    sidebar.classList.remove('flash-once');
    sidebar.classList.remove('unread');

    // update bar label to show loading
    var barLabel = sidebar.querySelector('.autosum-bar-label');
    if (barLabel) {
      barLabel.textContent = '\u25b6 ' + _t('loading');
    }

    var content = sidebar.querySelector('.autosum-content');
    if (content) {
      content.innerHTML = [
        '<div class="autosum-loading">',
        '  <div class="autosum-loading-spinner"></div>',
        '  <div class="autosum-loading-text">' + _t('analyzing') + '</div>',
        '</div>'
      ].join('\n');
    }

    var retryBtn = sidebar.querySelector('.autosum-retry-btn');
    if (retryBtn) retryBtn.disabled = true;
  }

  // show summary result
  function showSummary(summary) {
    if (!sidebar) createSidebar();
    isLoading = false;
    currentSummary = summary;

    var content = sidebar.querySelector('.autosum-content');
    if (content) {
      content.innerHTML = '<div class="autosum-summary">' + escapeHtml(summary) + '</div>';
    }

    var retryBtn = sidebar.querySelector('.autosum-retry-btn');
    if (retryBtn) retryBtn.disabled = false;

    // update bar label
    var barLabel = sidebar.querySelector('.autosum-bar-label');
    if (barLabel) {
      barLabel.textContent = '\u25b6 ' + _t('ready');
    }

    // if panel is collapsed and user hasn't read yet: flash once then glow
    if (isCollapsed && !hasBeenRead) {
      sidebar.classList.add('flash-once');
      sidebar.classList.add('unread');
    }
  }

  // show error state
  function showError(message) {
    if (!sidebar) createSidebar();
    isLoading = false;

    var content = sidebar.querySelector('.autosum-content');
    if (content) {
      content.innerHTML = '<div class="autosum-error">' + escapeHtml(message) + '</div>';
    }

    var retryBtn = sidebar.querySelector('.autosum-retry-btn');
    if (retryBtn) retryBtn.disabled = false;

    // update bar label to error
    var barLabel = sidebar.querySelector('.autosum-bar-label');
    if (barLabel) {
      barLabel.textContent = '\u25b6 ' + _t('err');
    }

    // remove ready indicators
    sidebar.classList.remove('flash-once');
    sidebar.classList.remove('unread');
  }

  // request retry from background service worker
  function requestRetry() {
    if (isLoading) return;
    showLoading();
    chrome.runtime.sendMessage({ action: 'retryAutoSum' });
  }

  // escape HTML for safe display
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // remove sidebar from page
  function removeSidebar() {
    if (sidebar) {
      sidebar.remove();
      sidebar = null;
    }
    var styles = document.getElementById('chrome-autosum-styles');
    if (styles) styles.remove();
    window.__autosumInjected = false;
  }

  // listen for messages from background service worker
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'showAutoSum') {
      if (request.lang) {
        _lang = request.lang;
      }
      createSidebar();
      showLoading();
      sendResponse({ status: 'sidebar_ready' });
    } else if (request.action === 'autoSumResult') {
      if (request.success) {
        showSummary(request.summary);
      } else {
        showError(request.error || 'unknown error');
      }
      sendResponse({ status: 'received' });
    } else if (request.action === 'hideAutoSum') {
      removeSidebar();
      sendResponse({ status: 'hidden' });
    }
    return true;
  });

  // expose for manual testing in console
  window.__autosum = {
    show: createSidebar,
    hide: removeSidebar,
    showLoading: showLoading,
    showSummary: showSummary,
    showError: showError
  };
})();
