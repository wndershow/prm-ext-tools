import { getStore, setStore } from '@/lib/storage';
import * as _url from '@/lib/url';

(async () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    new Promise((rs) => rs()).then(async () => {
      if (message === 'start_crawl') {
      } else if (message === 'close_tabs') {
        handleCloseTabs({ message, sendResponse, sender });
      } else if (message === 'new_tab') {
        handleNewTab({ message, sendResponse, sender });
      }
    });

    return true;
  });
})();

const handleCloseTabs = async ({ sender, sendResponse }) => {
  const { tab } = sender;
  if (!tab) return;
  let csId = _url.getQuery('__cs_id', tab.url);
  const penddingCloseTabs = await getStore('pendding_close_tabs', [], { namespace: `cs_${csId}` });
  console.info('close tab: ', penddingCloseTabs);
  chrome.tabs.remove(penddingCloseTabs);
  sendResponse('ok');
};

const handleNewTab = async ({ message, sendResponse, sender }) => {
  const { tab } = sender;
  if (!tab) return;
  let csId = _url.getQuery('__cs_id', tab.url);
  const penddingCloseTabs = await getStore('pendding_close_tabs', [], { namespace: `cs_${csId}` });
  penddingCloseTabs.push(tab.id);
  await setStore('pendding_close_tabs', [...penddingCloseTabs], { namespace: `cs_${csId}` });
  sendResponse('ok');
};
