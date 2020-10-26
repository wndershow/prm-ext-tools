import { useEffect } from 'react';
import { getQuery } from '@/lib/url';
import style from './style.scss';
import Crawler from '@/crawler';

const PageDetailFetchItemUrl = () => {
  const triggerType = getQuery('__trigger_type');
  const itemIdx = getQuery('__item_idx');
  const crawler = Crawler({ document });

  useEffect(async () => {
    if (triggerType === 'click') {
      const $btn = crawler.getJumpBtn(itemIdx);
      $btn && $btn.click();
    }
  }, []);

  return (
    <div className="container-page-detail">
      <style>{style[0][1]}</style>
    </div>
  );
};

export default PageDetailFetchItemUrl;
