import * as actions from './actions';

(async () => {
  chrome.runtime.onInstalled.addListener(() => {});

  chrome.runtime.onMessage.addListener(({ type, payload }, sender, sendResponse) => {
    new Promise((rs) => rs()).then(async () => {
      if (type === 'close_tab') {
        await actions.handleCloseTab({ payload, sendResponse, sender });
      }
      sendResponse('ok');
    });

    return true;
  });
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.info(tab);
  });

  chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId) {
    console.log('Tab ' + removedTabId + ' has been replaced by tab ' + addedTabId + '.');
  });
})();
