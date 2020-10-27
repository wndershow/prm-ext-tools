import { getStore, setStore } from '@/lib/storage';
import * as _url from '@/lib/url';
import * as _tab from '@/lib/tab';

(async () => {
  chrome.runtime.onInstalled.addListener(() => {});

  chrome.runtime.onMessage.addListener(({ type, payload }, sender, sendResponse) => {
    new Promise((rs) => rs()).then(async () => {
      if (type === 'start_crawl') {
      } else if (type === 'close_tabs') {
        await handleCloseTabs({ payload, sendResponse, sender });
      } else if (type === 'close_tab') {
        await handleCloseTab({ payload, sendResponse, sender });
      } else if (type === 'create_tab') {
        await handleCreateTab({ payload, sendResponse, sender });
      } else if (type === 'new_tab') {
        await handleNewTab({ payload, sendResponse, sender });
      }
      sendResponse('ok');
    });

    return true;
  });

  chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    let triggerTabInfo = await getStore(`trigger_tab_info_${tabId}`, null);
    if (triggerTabInfo && triggerTabInfo.forwardType === 1) {
      await updateCouponUrl({ triggerTabInfo, currentTab: tab });
      await _tab.remove([tab.id]);
      return;
    }

    triggerTabInfo = await getStore(`trigger_tab_info_${tab.openerTabId}`, null);
    console.info(triggerTabInfo, tab.openerTabId, tab.id);
    if (triggerTabInfo && triggerTabInfo.forwardType === 2) {
      await updateCouponUrl({ triggerTabInfo, currentTab: tab });
      await _tab.remove([tab.openerTabId, tab.id]);
      return;
    }
  });
})();

const handleCloseTabs = async ({ sender, sendResponse }) => {};

const handleCloseTab = async ({ sender, sendResponse }) => {
  const { tab } = sender;
  if (!tab) return;
  await _tab.remove([tab.id]);
};

const handleNewTab = async ({ payload, sendResponse, sender }) => {
  const { tab } = sender;
  if (!tab || !tab.id) return;

  const { csId, pageType, itemIdx, storeKwds, forwardType } = payload;

  if (pageType === 'trigger') {
    console.info(tab.id, '_____xxxxx');
    await setStore(`trigger_tab_info_${tab.id}`, {
      id: tab.id,
      csId,
      itemIdx,
      storeKwds,
      forwardType,
    });
  }
};

const handleCreateTab = async ({ payload, sendResponse, sender }) => {
  const { url, csId } = payload;
  const namespace = `cs_${csId}`;
  const { tab } = sender;

  await _tab.create({ url, active: true });

  await setStore(`root_tab_id`, tab && tab.id, { namespace });
};

const updateCouponUrl = async ({ triggerTabInfo, currentTab }) => {
  let hostname = _url.getHostname(currentTab.url).toLowerCase();

  if (hostname.indexOf(triggerTabInfo.storeKwds.toLowerCase()) >= 0) {
    const { csId, itemIdx } = triggerTabInfo;
    const namespace = `cs_${csId}`;

    const coupons = await getStore('coupons', [], { namespace });
    if (coupons[itemIdx]) {
      coupons[itemIdx].url = currentTab.url;
    }

    await setStore('coupons', coupons, { namespace });

    const rootTabId = await getStore('root_tab_id', 0, { namespace });
    console.info(rootTabId, '______');
    !!rootTabId && (await _tab.update(rootTabId, { active: true }));
  }
};
