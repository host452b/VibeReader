// this script runs in the context of the web page
// it extracts the visible text content of the page
function getPageContent() {
  // Strategy 1: Try Selection first (User intent is king)
  const selection = window.getSelection().toString().trim();
  if (selection && selection.length > 0) {
      return selection;
  }

  // Strategy 2: Readability-like Extraction (Main Content Focus)
  // We try to find the main content container to avoid navbars/footers
  const clone = document.body.cloneNode(true);
  
  // Clean junk (but less aggressive)
  // Removed 'header' and 'aside' from removal list as they sometimes contain key info
  const junkSelectors = [
      'script', 'style', 'noscript', 'iframe', 'svg', 
      '.ad', '.ads', '.advertisement'
  ];
  
  junkSelectors.forEach(sel => {
      clone.querySelectorAll(sel).forEach(el => el.remove());
  });

  // Instead of trying to find 'article' which might fail, let's grab everything
  // but prioritize main content structure.
  
  // Gather Meta Info
  let metaInfo = "";
  const title = document.title;
  const description = document.querySelector('meta[name="description"]')?.content;
  const keywords = document.querySelector('meta[name="keywords"]')?.content;
  const url = window.location.href;
  
  metaInfo += `Title: ${title}\n`;
  metaInfo += `URL: ${url}\n`;
  if (description) metaInfo += `Description: ${description}\n`;
  if (keywords) metaInfo += `Keywords: ${keywords}\n`;
  metaInfo += `----------------------------------------\n\n`;

  // Use innerText on the whole body to get what user sees
  // innerText is style-aware (ignores display:none)
  let visibleText = clone.innerText;

  // Clean up excessive whitespace
  visibleText = visibleText
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Max 2 newlines
      .replace(/[ \t]+/g, ' '); // Collapse spaces

  const lines = visibleText.split('\n');
  const cleanedLines = lines
        .map(line => line.trim())
        .filter(line => line.length > 0);
        
  visibleText = cleanedLines.join('\n');
  
  // Strategy 3: Fallback (If too short, maybe we aggressively removed too much)
  if (!visibleText || visibleText.length < 50) {
      // Last resort: outerHTML of body
      return metaInfo + document.body.innerText;
  }

  return metaInfo + visibleText;
}

// listen for messages from the popup or background
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "getPageContent" || request.action === "getContent") {
      const content = getPageContent();
      sendResponse({content: content});
    }
    // return true to indicate async response if needed (though here it's sync)
    return true;
  }
);
