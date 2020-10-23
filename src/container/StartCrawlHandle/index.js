import { useState } from 'react';
import style from './style.scss';
import ListForm from '@/components/ListForm';

const StartCrawlHandle = () => {
  const [showListForm, setShowListForm] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const handleCrawl = () => {
    const $couponItems = document.querySelectorAll('section.cept-voucher-widget>article');
    let ces = [];
    $couponItems.forEach($item => {
      let t = $item.querySelector('a.js-gutscheinsammler-item').getAttribute('data-voucher-button');
      t = t.match(/[\d]{1,}/);
      let id = t[0] || '';
      let title = $item.querySelector('div.cept-voucher-widget-item-title').textContent;
      ces.push({
        __id: id,
        title,
        type: 'code',
        code: '',
      });
    });

    setShowListForm(true);
    setCoupons(ces);

    // chrome.runtime.sendMessage('start_crawl');
  };
  return (
    <div className="container-start-crawl-handle">
      {!showListForm && <button onClick={handleCrawl}>start crawl</button>}

      {showListForm && (
        <ListForm
          onChange={({ idx, value }) => {
            const ces = [...coupons];
            ces[idx] = value;
            setCoupons(ces);
          }}
          coupons={coupons}
          onClose={() => setShowListForm(false)}
        ></ListForm>
      )}

      <style>{style[0][1]}</style>
    </div>
  );
};

export default StartCrawlHandle;