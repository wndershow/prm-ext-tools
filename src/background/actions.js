import { setStore } from '@/lib/storage';
import * as _tab from '@/lib/tab';

export const handleCloseTab = async ({ payload, sendResponse, sender }) => {
  const { tab } = sender;
  _tab.remove([tab.id]);
};

export const handleOutTabCreated = async ({ payload, sendResponse, sender }) => {
  const { tab } = sender;
  const { csId } = payload;
  const namespace = `cs_${csId}`;

  await setStore('out_tab_id', tab.id, { namespace });
};

export const handleOpenPageByTab = async ({ payload, sendResponse, sender }) => {
  const { tab: listTab } = sender;
  const { url, csId } = payload;
  const namespace = `cs_${csId}`;

  await setStore('list_tab_id', listTab.id, { namespace });

  const outTab = await _tab.create({
    url,
  });

  await setStore('out_tab_id', outTab.id, { namespace });

  // chrome.tabs.executeScript(
  //   outTab.id,
  //   {
  //     file: 'tab.js',
  //     allFrames: true,
  //     runAt: 'document_idle',
  //   },
  //   function(resultArray) {
  //     console.log(resultArray);
  //   }
  // );
};
