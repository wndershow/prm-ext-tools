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
  const [loading, setLoading] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [csDomain, setCsDomain] = useState('');
  const [csStauts, setCsStatus] = useState('');
  const [relateStoreUrls, setRelateStoreUrls] = useState([]);

  const crawler = useRef(null);

  const serverType = getQuery('__st');
  const cid = getQuery('__cid');
  const csId = getQuery('__cs_id');
  const storeKwds = getQuery('__store_kwds');

  const namespace = `cs_${csId}`;

  let { coupons } = useStore('coupons', { namespace });

  const handleStart = async () => {
    await clear(namespace);
    setLoading(true);
    setHideListForm(false);

    const csUrl = getCurrentUrlPath();

    const { coupons: sces = [], domain, status } = await $api.getCsInfo(csId, { st: serverType });
    setCsDomain(domain);
    setCsStatus(status);

    let ces = await crawler.current.getCoupons({
      csId,
      storeKwds,
      csUrl,
      sourceCoupons: sces,
    });

    const relateStoreUrls = crawler.current.getRelateStoreUrls(csUrl);
    setRelateStoreUrls(relateStoreUrls);

    await setStore('coupons', ces, { namespace });

    setShowListForm(true);

    setLoading(false);
  };

  useEffect(async () => {
    const c = await Crawler({ cid }, { st: serverType });
    c.setDocument(document);
    crawler.current = c;
  }, []);

  const handleRefresh = async () => {
    setLoadingRefresh(true);
    const c = await Crawler({ cid, cache: false }, { st: serverType });
    c.setDocument(document);
    crawler.current = c;
    setLoadingRefresh(false);
  };

  coupons = coupons || [];

  return (
    <div className="container-page-list">
      <div className="-menus">
        <div className="mb1">
          <button onClick={handleStart}>Start{loading && '...'}</button>
        </div>

        {showListForm && hideListForm && (
          <div className="mb1">
            <button onClick={() => setHideListForm(false)}>Show list</button>
          </div>
        )}

        <div className="mb1">
          <button onClick={handleRefresh}>Refresh{loadingRefresh && '...'}</button>
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
          supportCouponOutUrl={crawler.current.supportCouponOutUrl}
          csDomain={csDomain}
          csStatus={csStauts}
          csId={csId}
          serverType={serverType}
          relateStoreUrls={relateStoreUrls}
        ></ListForm>
      )}

      <style>{style[0][1]}</style>
    </div>
  );
};

export default PageList;
