export const sendMsg = (message, options = {}) => {
  return new Promise((rs, rj) => {
    chrome.runtime.sendMessage(message, function (response) {
      rs(response);
    });
  });
};

export const addMsgListener = (listener = (message, sender, sendResponse) => {}) => {
  return chrome.runtime.onMessage.addListener(listener);
};
