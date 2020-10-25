export const sendMsg = (type, payload = {}) => {
  return new Promise((rs, rj) => {
    chrome.runtime.sendMessage({ type, payload }, function(response) {
      rs(response);
    });
  });
};

export const addMsgListener = (listener = (message, sender, sendResponse) => {}) => {
  return chrome.runtime.onMessage.addListener(listener);
};
