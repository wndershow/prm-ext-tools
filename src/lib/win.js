export const getCurrentId = () => {
  return new Promise((rs, rj) => {
    chrome.windows.getCurrent(function(currentWindow) {
      rs(currentWindow.id);
    });
  });
};
