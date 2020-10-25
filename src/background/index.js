import { getStore, setStore } from '@/lib/storage';
import * as _url from '@/lib/url';

(async () => {
  chrome.runtime.onMessage.addListener(({ type, payload }, sender, sendResponse) => {
    new Promise(rs => rs()).then(async () => {
      if (type === 'start_crawl') {
      } else if (type === 'close_tabs') {
        await handleCloseTabs({ payload, sendResponse, sender });
      } else if (type === 'close_tab') {
        await handleCloseTab({ payload, sendResponse, sender });
      } else if (type === 'new_tab') {
        await handleNewTab({ payload, sendResponse, sender });
      }
      sendResponse('ok');
    });

    return true;
  });

  chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    let ti = await getStore(`detail_trigger_tab_info_${tab.id}`, {});
    if (ti.domain) {
      let hostname = _url.getHostname(tab.url);
      if (hostname.indexOf(ti.domain) >= 0) {
        const { csId, itemIdx } = ti;
        const namespace = `cs_${csId}`;

        const coupons = await getStore('coupons', [], { namespace });
        if (coupons[itemIdx]) {
          coupons[itemIdx].url = tab.url;
        }
        await setStore('coupons', coupons, { namespace });
        chrome.tabs.remove([tab.id]);
      }
    }
    // const csId = _url.getQuery('__cs_id');
    // const namespace = `cs_${csId}`;
    // const tid = await getStore('detail_trigger_tab_id', 0, { namespace });
    // if (tabId === tid) {
    //   console.info(tab.url);
    // }
  });
})();

const handleCloseTabs = async ({ sender, sendResponse }) => {
  const { tab } = sender;
  if (!tab) return;
  const namespace = `cs_${csId}`;
  let csId = _url.getQuery('__cs_id', tab.url);
  const penddingCloseTabs = await getStore('pendding_close_tabs', [], { namespace });
  chrome.tabs.remove(penddingCloseTabs);
};

const handleCloseTab = async ({ sender, sendResponse }) => {
  const { tab } = sender;
  if (!tab) return;
  chrome.tabs.remove([tab.id]);
};

const handleNewTab = async ({ payload, sendResponse, sender }) => {
  const { tab } = sender;
  if (!tab || !tab.id) return;
  const namespace = `cs_${csId}`;

  const { csId, pageType, itemIdx, domain } = payload;
  if (pageType === 'detail_trigger') {
    await setStore(`detail_trigger_tab_info_${tab.id}`, {
      id: tab.id,
      csId,
      itemIdx,
      domain,
    });
  }

  const penddingCloseTabs = await getStore('pendding_close_tabs', [], { namespace });

  penddingCloseTabs.push(tab.id);

  await setStore('pendding_close_tabs', [...penddingCloseTabs], { namespace });
};
