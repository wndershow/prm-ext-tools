export const getLang = (tabId = null) => {
  return new Promise((rs, rj) => {
    chrome.tabs.detectLanguage(tabId, function(lang) {
      rs(lang);
    });
  });
};
