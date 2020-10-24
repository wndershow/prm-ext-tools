import { useEffect } from 'react';
import { getQuery } from '@/lib/url';
import { setStore, getStore } from '@/lib/storage';
import { sendMsg } from '@/lib/runtime';
import style from './style.scss';

const PageDetail = () => {
  const triggerType = getQuery('__trigger_type');
  const itemIdx = getQuery('__item_idx');
  const csId = getQuery('__cs_id');
  const triggedKey = `trigged_${itemIdx}`;

  useEffect(async () => {
    const trigged = await getStore(triggedKey, false, { namespace: `cs_${csId}` });
    await sendMsg('new_tab');

    console.info(triggerType, `____0`, trigged);

    if (triggerType === 'click' && !trigged) {
      console.info(`____1`);
      await setStore(triggedKey, true, { namespace: `cs_${csId}` });
      const $couponItems = document.querySelectorAll('section.cept-voucher-widget>article');
      const $item = $couponItems[itemIdx];
      $item && $item.querySelector('div.voucher-btn').click();
    } else if (triggerType === 'click' && trigged) {
      console.info(`____2`);

      const $track = document.querySelector('div.popover-content input[data-copy-to-clipboard]');
      const detailCode = {
        idx: itemIdx,
        code: ($track && $track.value) || '',
      };
      await setStore('detailCode', detailCode, { namespace: `cs_${csId}` });

      sendMsg('close_tabs');
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
