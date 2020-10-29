import { useState, useEffect, useRef } from 'react';
import style from './style.scss';
import ListForm from '@/components/ListForm';
import { useStore, clear, setStore } from '@/lib/storage';
import { getQuery, getCurrentUrlPath } from '@/lib/url';
import * as $api from '@/apis';
import Crawler from '@/crawlers';

const PageList = () => {
  const [showListForm, setShowListForm] = useState(false);
  const [hideListForm, setHideListForm] = useState(false);
  const [csDomain, setCsDomain] = useState('');
  const [csStauts, setCsStatus] = useState('');

  const crawler = useRef(null);

  const cid = getQuery('__cid');
  const csId = getQuery('__cs_id');
  const storeKwds = getQuery('__store_kwds');

  const namespace = `cs_${csId}`;

  let { coupons } = useStore('coupons', { namespace });

  const handleStart = async () => {
    await clear(namespace);

    setHideListForm(false);

    const csUrl = getCurrentUrlPath();

    const { coupons: sces = [], domain, status } = await $api.getCsInfo(csId);
    setCsDomain(domain);
    setCsStatus(status);

    let ces = await crawler.current.getCoupons({
      csId,
      storeKwds,
      csUrl,
      sourceCoupons: sces,
    });

    await setStore('coupons', ces, { namespace });

    setShowListForm(true);
  };

  useEffect(async () => {
    const c = await Crawler({ cid });
    c.setDocument(document);
    crawler.current = c;
  }, []);

  const handleRefresh = async () => {
    const c = await Crawler({ cid, cache: false });
    c.setDocument(document);
    crawler.current = c;
  };

  coupons = coupons || [];

  return (
    <div className="container-page-list">
      <div className="-menus">
        <div className="mb1">
          <button onClick={handleStart}>start</button>
        </div>

        {showListForm && hideListForm && (
          <div className="mb1">
            <button onClick={() => setHideListForm(false)}>show list</button>
          </div>
        )}

        <div className="mb1">
          <button onClick={handleRefresh}>refresh</button>
        </div>
      </div>

      {showListForm && (
        <ListForm
          className={hideListForm && 'dn'}
          onChange={async ({ idx, value }) => {
            const ces = [...coupons];
            ces[idx] = value;
            await setStore('coupons', ces, { namespace });
          }}
          coupons={coupons}
          onClose={() => setShowListForm(false)}
          onHide={() => setHideListForm(true)}
          supportCouponItemUrl={crawler.current.supportCouponItemUrl}
          csDomain={csDomain}
          csStatus={csStauts}
          csId={csId}
        ></ListForm>
      )}

      <style>{style[0][1]}</style>
    </div>
  );
};

export default PageList;
