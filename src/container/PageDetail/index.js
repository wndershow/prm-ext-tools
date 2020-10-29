import { useEffect } from 'react';
import { getQuery } from '@/lib/url';
import { setStore, getStore } from '@/lib/storage';
import { sendMsg } from '@/lib/runtime';
import Crawler from '@/crawlers';
import style from './style.scss';

const PageDetail = () => {
  const itemIdx = getQuery('__item_idx');
  const cid = getQuery('__cid');
  const csId = getQuery('__cs_id');
  const namespace = `cs_${csId}`;

  useEffect(async () => {
    const crawler = await Crawler({ cid });
    crawler.setDocument(document);

    const code = crawler.getCouponDetailCode();

    const coupons = await getStore('coupons', [], { namespace });

    if (coupons[itemIdx] && code) {
      coupons[itemIdx].code = code;
      await setStore('coupons', coupons, { namespace });
      await sendMsg('close_tab');
    }
  }, []);

  return (
    <div>
      <style>{style[0][1]}</style>
    </div>
  );
};

export default PageDetail;
