import * as actions from './actions';

(async () => {
  chrome.runtime.onInstalled.addListener(() => {});

  chrome.runtime.onMessage.addListener(({ type, payload }, sender, sendResponse) => {
    new Promise(rs => rs()).then(async () => {
      if (type === 'close_tab') {
        await actions.handleCloseTab({ payload, sendResponse, sender });
      } else if (type === 'out_tab_created') {
        await actions.handleOutTabCreated({ payload, sendResponse, sender });
      } else if (type === 'open_page_by_tab') {
        await actions.handleOpenPageByTab({ payload, sendResponse, sender });
      }
      sendResponse('ok');
    });

    return true;
  });

  chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    // const out_tab_id = await getStore('out_tab_id');
    // await actions.handleOutTabChanged({ payload, sendResponse, sender });
  });

  chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
    // console.log('Tab ' + removedTabId + ' has been replaced by tab ' + addedTabId + '.');
  });
})();
