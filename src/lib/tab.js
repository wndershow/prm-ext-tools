export const getLang = (tabId = null) => {
  return new Promise((rs, rj) => {
    chrome.tabs.detectLanguage(tabId, function(lang) {
      rs(lang);
    });
  });
};

export const create = ({ index = 0, url, active = true }) => {
  return new Promise((rs, rj) => {
    chrome.tabs.create(
      {
        index,
        url,
        active,
      },
      tab => rs(tab)
    );
  });
};

export const update = (tabId, opts = {}) => {
  return new Promise((rs, rj) => {
    chrome.tabs.update(
      tabId,
      {
        ...opts,
      },
      function(tab) {
        rs(tab);
      }
    );
  });
};

export const get = tabId => {
  return new Promise((rs, rj) => {
    chrome.tabs.get(tabId, function(tab) {
      rs(tab);
    });
  });
};

export const getCurrent = () => {
  return new Promise((rs, rj) => {
    chrome.tabs.getCurrent(function(tab) {
      rs(tab);
    });
  });
};

export const getActives = ({ windowId = null } = {}) => {
  return new Promise((rs, rj) => {
    chrome.tabs.query(
      {
        windowId,
        active: true,
      },
      function(tabArray) {
        rs(tabArray);
      }
    );
  });
};
