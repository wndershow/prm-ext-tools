import React from 'react';
import { useTrendingStores } from '@/hooks';
import Loading from '@/components/Loading';
import style from './style.scss';
import Image from '@/components/Image';

export default () => {
  const { stores, loading } = useTrendingStores();
  console.info(stores);
  return (
    <div className="com-trending-stores">
      <div className="flex items-center -hd">
        <h4 className="flex-auto">Trending Stores</h4>
        <div>View All</div>
      </div>
      <div className="-bd">
        {loading ? (
          <Loading></Loading>
        ) : (
          <ul>
            {stores.map(n => (
              <li key={n.id}>
                <div className="--inner">
                  <a className="flex items-center" href={n.affUrl} target="_blank">
                    <Image path={n.logoPic}></Image>
                  </a>
                  <span>{n.name}</span>
                  <div>
                    <a className="btn" href={n.affUrl} target="_blank">
                      Go Shopping
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <style>{style[0][1]}</style>
    </div>
  );
};
