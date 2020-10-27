import { useEffect } from 'react';
import { getQuery } from '@/lib/url';
import { holder } from '@/lib/helper';
import { setStore, getStore } from '@/lib/storage';
import { sendMsg } from '@/lib/runtime';
import Crawler from '@/crawler';
import style from './style.scss';

const PageDetail = () => {
  const forwardType = getQuery('__forward_type');
  const itemIdx = getQuery('__item_idx');
  const csId = getQuery('__cs_id');
  const storeKwds = getQuery('__store_kwds');
  const triggedKey = `trigged_${itemIdx}`;
  const namespace = `cs_${csId}`;
  const crawler = Crawler({ document });

  useEffect(async () => {
    const trigged = await getStore(triggedKey, false, { namespace });

    if (forwardType === '1' && !trigged) {
      await sendMsg('new_tab', { csId, pageType: 'trigger', itemIdx, storeKwds, forwardType: parseInt(forwardType) });

      await setStore(triggedKey, true, { namespace });
      const $trigger = crawler.getDetailTrigger(itemIdx);
      $trigger && $trigger.click();
    } else if (forwardType === '1' && trigged) {
      crawler.setDocument(document);
      const code = crawler.getCouponDetailCode();

      const coupons = await getStore('coupons', [], { namespace });
      if (coupons[itemIdx]) {
        coupons[itemIdx].code = code;
      }

      await setStore('coupons', coupons, { namespace });

      await sendMsg('close_tab');
    } else if (forwardType === '2') {
      await holder(300);
      await sendMsg('new_tab', { csId, pageType: 'trigger', itemIdx, storeKwds, forwardType: parseInt(forwardType) });
      const $trigger = crawler.getDetailTrigger(itemIdx);
      $trigger && $trigger.click();
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
