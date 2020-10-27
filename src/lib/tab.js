export const getLang = (tabId = null) => {
  return new Promise((rs, rj) => {
    chrome.tabs.detectLanguage(tabId, function (lang) {
      rs(lang);
    });
  });
};

export const create = (options = {}) => {
  return new Promise((rs, rj) => {
    chrome.tabs.create(
      {
        ...options,
      },
      (tab) => rs(tab)
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
      function (tab) {
        if (chrome.runtime.lastError) {
          rs(null);
        } else {
          rs(tab);
        }
      }
    );
  });
};

export const get = (tabId) => {
  return new Promise((rs, rj) => {
    chrome.tabs.get(tabId, function (tab) {
      if (chrome.runtime.lastError) {
        rs(null);
      } else {
        rs(tab);
      }
    });
  });
};

export const getCurrent = () => {
  return new Promise((rs, rj) => {
    chrome.tabs.getCurrent(function (tab) {
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
      function (tabArray) {
        rs(tabArray);
      }
    );
  });
};

export const remove = async (tabIds) => {
  await new Promise(async (rs, rj) => {
    for (let index = 0; index < tabIds.length; index++) {
      const tid = tabIds[index];
      let tab = await get(tid);
      if (tab && tab.id) {
        await removeById(tab.id);
      }
    }
    rs();
  });
};

export const removeById = (tabId) => {
  return new Promise(async (rs, rj) => {
    chrome.tabs.remove([tabId], function () {
      if (chrome.runtime.lastError) {
        rs();
      } else {
        rs();
      }
    });
  });
};
