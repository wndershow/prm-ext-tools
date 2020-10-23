import * as _win from '@/lib/win';
import * as _tab from '@/lib/tab';
import * as _helper from '@/lib/helper';
import * as _storage from '@/lib/storage';

(async () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    new Promise(rs => rs()).then(async () => {
      if (message === 'start_crawl') {
        handleStartCrawl({ message, sendResponse, sender });
      }
    });

    return true;
  });
})();

const handleStartCrawl = async () => {
  let tabs = await _tab.getActives();
  window.alert(tabs[0].id);
};
