export const sendMsg = (message, options = {}) => {
  return new Promise((rs, rj) => {
    chrome.runtime.sendMessage(message, options, function(response) {
      rs(response);
    });
  });
};

export const addMsgListener = (listener = (message, sender, sendResponse) => {}) => {
  return new Promise((rs, rj) => {
    chrome.runtime.onMessage.addListener(listener);
  });
};
