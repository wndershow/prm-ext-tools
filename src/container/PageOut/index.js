import { useEffect } from 'react';
import { getQuery } from '@/lib/url';
import { sendMsg } from '@/lib/runtime';
import style from './style.scss';

const PageOut = () => {
  const itemIdx = getQuery('__item_idx');
  const cid = getQuery('__cid');
  const csId = getQuery('__cs_id');

  useEffect(async () => {
    window.alert(22222);
    await sendMsg('out_tab_created', { itemIdx, cid, csId });
  }, []);

  return (
    <div>
      <style>{style[0][1]}</style>
    </div>
  );
};

export default PageOut;
