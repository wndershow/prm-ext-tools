import useReq from '@/lib/request';

export const useGetCouponsByDomain = domain => {
  const { loading, data, error } = useReq(`/us/get-coupons-by-domain/${domain}`);

  const { coupons = [] } = data;

  return { coupons, loading, error };
};

export const useTrendingStores = domain => {
  const { loading, data, error } = useReq(`/us/get-trending-stores`);

  const { stores = [] } = data;

  return { stores, loading, error };
};

export const useStoresByKwds = kwds => {
  const { loading, data, error } = useReq(`/us/get-stores-by-kwds`, {
    params: {
      kwds,
    },
    skip: !!!kwds,
  });

  const { stores = [] } = data;

  return { stores, loading, error };
};
