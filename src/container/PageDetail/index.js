import { useEffect } from 'react';
import { getQuery } from '@/lib/url';
import { setStore, getStore } from '@/lib/storage';
import { sendMsg } from '@/lib/runtime';
import style from './style.scss';

const PageDetail = () => {
  const triggerType = getQuery('__trigger_type');
  const itemIdx = getQuery('__item_idx');
  const csId = getQuery('__cs_id');
  const domain = getQuery('__domain');
  const triggedKey = `trigged_${itemIdx}`;
  const namespace = `cs_${csId}`;

  useEffect(async () => {
    const trigged = await getStore(triggedKey, false, { namespace });

    if (triggerType === 'click' && !trigged) {
      await sendMsg('new_tab', { csId, pageType: 'detail_trigger', itemIdx, domain });

      await setStore(triggedKey, true, { namespace });
      const $couponItems = document.querySelectorAll('section.cept-voucher-widget>article');
      const $item = $couponItems[itemIdx];
      $item && $item.querySelector('div.voucher-btn').click();
    } else if (triggerType === 'click' && trigged) {
      await sendMsg('new_tab', { csId, pageType: 'detail_code', itemIdx, domain });

      const $track = document.querySelector('div.popover-content input[data-copy-to-clipboard]');
      const code = ($track && $track.value) || '';

      const coupons = await getStore('coupons', [], { namespace });
      if (coupons[itemIdx]) {
        coupons[itemIdx].code = code;
      }

      await setStore('coupons', coupons, { namespace });

      await sendMsg('close_tab');
    }
  }, []);

  return (
    <div className="container-page-detail">
      PageDetail
      <style>{style[0][1]}</style>
    </div>
  );
};

export default PageDetail;
