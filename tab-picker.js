// standalone tab picker window logic
// communicates back to popup.js via chrome.runtime.sendMessage

(function() {
  var tabList = document.getElementById('tabList');
  var countEl = document.getElementById('count');
  var loadBtn = document.getElementById('loadBtn');
  var cancelBtn = document.getElementById('cancelBtn');
  var selectAllBtn = document.getElementById('selectAll');
  var selectNoneBtn = document.getElementById('selectNone');

  function updateCount() {
    var checked = tabList.querySelectorAll('input[type="checkbox"]:checked');
    countEl.textContent = checked.length + ' selected';
    loadBtn.disabled = (checked.length === 0);
  }

  function renderTabs(tabs) {
    tabList.innerHTML = '';

    if (tabs.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No accessible tabs found';
      tabList.appendChild(empty);
      return;
    }

    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];

      var item = document.createElement('label');
      item.className = 'tab-item';

      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = tab.id;
      if (tab.active) {
        cb.checked = true;
      }
      cb.addEventListener('change', updateCount);
      item.appendChild(cb);

      if (tab.favIconUrl) {
        var fav = document.createElement('img');
        fav.className = 'tab-favicon';
        fav.src = tab.favIconUrl;
        fav.onerror = function() { this.style.display = 'none'; };
        item.appendChild(fav);
      }

      var info = document.createElement('div');
      info.className = 'tab-info';

      var titleEl = document.createElement('div');
      titleEl.className = 'tab-title';
      titleEl.textContent = tab.title;
      info.appendChild(titleEl);

      var urlEl = document.createElement('div');
      urlEl.className = 'tab-url';
      urlEl.textContent = tab.url;
      info.appendChild(urlEl);

      item.appendChild(info);

      if (tab.active) {
        var badge = document.createElement('span');
        badge.className = 'tab-badge';
        badge.textContent = 'ACTIVE';
        item.appendChild(badge);
      }

      tabList.appendChild(item);
    }

    updateCount();
  }

  function loadTabs() {
    chrome.windows.getLastFocused(function(focusedWin) {
      var focusedWindowId = focusedWin ? focusedWin.id : -1;

      chrome.tabs.query({}, function(allTabs) {
        if (chrome.runtime.lastError) {
          renderTabs([]);
          return;
        }

        var filtered = [];
        for (var i = 0; i < allTabs.length; i++) {
          var tab = allTabs[i];
          var url = tab.url || tab.pendingUrl || '';
          if (!url) continue;
          if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:') || url.startsWith('edge://')) continue;

          filtered.push({
            id: tab.id,
            title: tab.title || url,
            url: url,
            favIconUrl: tab.favIconUrl || '',
            active: tab.active && tab.windowId === focusedWindowId
          });
        }

        // active tab first
        filtered.sort(function(a, b) {
          if (a.active && !b.active) return -1;
          if (!a.active && b.active) return 1;
          return 0;
        });

        renderTabs(filtered);
        setTimeout(resizeToFit, 50);
      });
    });
  }

  // select all / none
  selectAllBtn.addEventListener('click', function() {
    var cbs = tabList.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < cbs.length; i++) cbs[i].checked = true;
    updateCount();
  });

  selectNoneBtn.addEventListener('click', function() {
    var cbs = tabList.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < cbs.length; i++) cbs[i].checked = false;
    updateCount();
  });

  // load selected: send tab IDs back to popup.js and close
  loadBtn.addEventListener('click', function() {
    var checked = tabList.querySelectorAll('input[type="checkbox"]:checked');
    var tabIds = [];
    for (var i = 0; i < checked.length; i++) {
      tabIds.push(parseInt(checked[i].value, 10));
    }
    chrome.runtime.sendMessage({ action: 'tabPickerResult', tabIds: tabIds });
    window.close();
  });

  // cancel
  cancelBtn.addEventListener('click', function() {
    window.close();
  });

  // keyboard: Escape to cancel
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') window.close();
  });

  // resize window to fit content after tabs are loaded
  function resizeToFit() {
    var headerH = 46;
    var footerH = 50;
    var itemH = 48;
    var items = tabList.querySelectorAll('.tab-item');
    var count = items.length;
    if (count === 0) count = 1;

    var maxVisible = 15;
    var visibleCount = Math.min(count, maxVisible);
    var listH = visibleCount * itemH;
    var totalH = headerH + listH + footerH + 2;

    // clamp height
    var minH = 200;
    var maxH = 700;
    var finalH = Math.max(minH, Math.min(totalH, maxH));

    // find longest title to determine width
    var maxTitleLen = 30;
    for (var i = 0; i < items.length; i++) {
      var titleEl = items[i].querySelector('.tab-title');
      if (titleEl && titleEl.textContent.length > maxTitleLen) {
        maxTitleLen = titleEl.textContent.length;
      }
    }
    var charWidth = 7;
    var padding = 120;
    var calcWidth = Math.max(380, Math.min(maxTitleLen * charWidth + padding, 650));

    var newW = Math.round(calcWidth);
    var newH = Math.round(finalH);

    chrome.windows.getCurrent(function(pickerWin) {
      if (!pickerWin) return;

      chrome.windows.getLastFocused({ windowTypes: ['normal'] }, function(parentWin) {
        var left = pickerWin.left;
        var top = pickerWin.top;
        if (parentWin) {
          left = Math.round(parentWin.left + (parentWin.width - newW) / 2);
          top = Math.round(parentWin.top + (parentWin.height - newH) / 2);
        }
        chrome.windows.update(pickerWin.id, {
          width: newW,
          height: newH,
          left: Math.max(0, left),
          top: Math.max(0, top)
        });
      });
    });
  }

  // load on open
  loadTabs();
})();
