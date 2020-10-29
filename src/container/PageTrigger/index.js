import { useEffect } from 'react';
import { getQuery } from '@/lib/url';
import { holder } from '@/lib/helper';
import { setStore, getStore } from '@/lib/storage';
import { sendMsg } from '@/lib/runtime';
import Crawler from '@/crawlers';
import style from './style.scss';

const PageTrigger = () => {
  const forwardType = getQuery('__forward_type');
  const itemIdx = getQuery('__item_idx');
  const cid = getQuery('__cid');
  const csId = getQuery('__cs_id');
  const storeKwds = getQuery('__store_kwds');
  const triggedKey = `trigged_${itemIdx}`;
  const namespace = `cs_${csId}`;

  useEffect(async () => {
    const trigged = await getStore(triggedKey, false, { namespace });
    const crawler = await Crawler({ cid });
    await holder(300);

    crawler.setDocument(document);

    if (forwardType === '1' && !trigged) {
      await sendMsg('on_trigger_page_opened', {
        csId,
        pageType: 'trigger',
        itemIdx,
        storeKwds,
        forwardType: parseInt(forwardType),
      });

      await setStore(triggedKey, true, { namespace });
      const $trigger = crawler.getDetailTrigger(itemIdx);
      $trigger && $trigger.click();
    } else if (forwardType === '1' && trigged) {
      await holder(1000);
      crawler.setDocument(document);
      const code = crawler.getCouponDetailCode();

      const coupons = await getStore('coupons', [], { namespace });
      if (coupons[itemIdx] && code) {
        coupons[itemIdx].code = code;
        await setStore('coupons', coupons, { namespace });
        await sendMsg('close_tab');
      }
    } else if (forwardType === '2') {
      await sendMsg('on_trigger_page_opened', {
        csId,
        pageType: 'trigger',
        itemIdx,
        storeKwds,
        forwardType: parseInt(forwardType),
      });

      const $trigger = crawler.getDetailTrigger(itemIdx);
      $trigger && $trigger.click();

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

export default PageTrigger;
