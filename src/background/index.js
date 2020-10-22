import { getCurrentId } from '@/lib/win';
import { getLang } from '@/lib/tab';
(async () => {
  // chrome.tabs.create({
  //   windowId: wid,
  //   index: 0,
  //   url: 'https://www.google.com',
  //   active: true,
  //   pinned: false,
  // });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    new Promise(rs => rs({ message, sender, sendResponse })).then(handleHello);
    return true;
  });
})();

const handleHello = async ({ sendResponse }) => {
  const wid = await getCurrentId();
  const lang = await getLang();
  sendResponse({ lang, wid });
};
