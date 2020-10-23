import { useEffect, useState } from 'react';
import style from '@/app.scss';
import StartCrawlHandle from '@/container/StartCrawlHandle';
import * as _storage from '@/lib/storage';

export default () => {
  const [pageType, setPageType] = useState('');

  useEffect(async () => {
    const parseUrl = new URL(window.location.href);
    const __page_type = parseUrl.searchParams.get('__page_type');
    const __idx = parseUrl.searchParams.get('__idx');
    setPageType(__page_type);
    const { __last_detail_idx: lastDetailIdx } = await _storage.get({ __last_detail_idx: '' });
    if (__page_type === 'detail' && !lastDetailIdx) {
      await _storage.set({ __last_detail_idx: __idx });
      const $couponItems = document.querySelectorAll('section.cept-voucher-widget>article');
      const $item = $couponItems[__idx];
      $item && $item.querySelector('div.voucher-btn').click();
    } else if (__page_type === 'detail' && lastDetailIdx) {
      const $track = document.querySelector('div.popover-content input[data-copy-to-clipboard]');
      await _storage.set({ __last_detail_idx: '' });
    }
  }, []);

  return (
    <div className="app">
      {pageType === 'list' && <StartCrawlHandle></StartCrawlHandle>}
      <style>{style[0][1]}</style>
    </div>
  );
};
