import React, { useState } from 'react';
import SearchBox from '@/components/SearchBox';
import TrendingStores from '@/components/TrendingStores';
import { useStoresByKwds } from '@/hooks';
import Loading from '@/components/Loading';
import StoreSearchRs from '@/components/StoreSearchRs';

export default () => {
  const [kwds, setKwds] = useState('');
  const { stores, loading } = useStoresByKwds(kwds);

  return (
    <div className="com-app-body">
      <div className="-search-box">
        <SearchBox
          onSearch={kwds => {
            console.info(kwds);
            setKwds(kwds);
          }}
        ></SearchBox>
      </div>
      <div className="-trending-stores">
        {kwds && <div>{loading ? <Loading /> : <StoreSearchRs stores={stores} />}</div>}
        <div className={kwds && 'dn'}>
          <TrendingStores></TrendingStores>
        </div>
      </div>
    </div>
  );
};
