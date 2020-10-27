import { useState } from 'react';
import style from './style.scss';
import ListForm from '@/components/ListForm';
import { useStore, clear, setStore } from '@/lib/storage';
import { getQuery } from '@/lib/url';
import Crawler from '@/crawler';

const PageList = () => {
  const [showListForm, setShowListForm] = useState(false);
  const csId = getQuery('__cs_id');
  const namespace = `cs_${csId}`;
  const crawler = Crawler({ document });

  let { coupons } = useStore('coupons', { namespace });
  coupons = coupons || [];

  const handleCrawl = async () => {
    await clear(namespace);

    let ces = await crawler.getCoupons({ csId, storeKwds: 'lidl', csUrl: 'https://www.mydealz.de/gutscheine/lidl-de' });

    await setStore('coupons', ces, { namespace });

    setShowListForm(true);
  };

  return (
    <div className="container-page-list">
      <div className="-menus">
        {!showListForm && (
          <div>
            <button onClick={handleCrawl}>start crawl</button>
          </div>
        )}
        <div>
          <button onClick={handleCrawl}>test</button>
        </div>
      </div>

      {showListForm && (
        <ListForm
          onChange={({ idx, value }) => {
            const ces = [...coupons];
            ces[idx] = value;
            setStore('coupons', ces, { namespace });
          }}
          coupons={coupons}
          onClose={() => setShowListForm(false)}
        ></ListForm>
      )}

      <style>{style[0][1]}</style>
    </div>
  );
};

export default PageList;
