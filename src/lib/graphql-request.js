import { GraphQLClient } from 'graphql-request';
const endPoint0 = process.env.END_POINT_S0;
const endPoint1 = process.env.END_POINT_S1;
const endPoint2 = process.env.END_POINT_S2;

export default (st = 's2') => {
  let endPoint = endPoint2;

  if (st === 's1') {
    endPoint = endPoint1;
  } else if (st === 's0') {
    endPoint = endPoint0;
  }

  return new GraphQLClient(endPoint);
};

export const useGr = (
  query,
  variables,
  { headers = {}, onSuccess = null, onError = null, skip = false, interval = 0 } = {}
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(null);
  const it = useRef(null);

  const refetch = async (options = {}) => {
    setLoading(true);

    let rs = null;

    try {
      rs = await client.request(query, variables);

      if (isMountedRef.current) {
        setData(rs.data);
      }

      onSuccess && onSuccess(rs);
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
      }
      onError && onError(err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (skip) return;
    refetch();
    if (interval) {
      it.current = setInterval(() => {
        refetch();
      }, interval);
    }
    return () => {
      it.current && clearInterval(it.current);
      isMountedRef.current = false;
    };
  }, [variables, skip]);

  useEffect(() => {
    if (!interval) {
      it.current && clearInterval(it.current);
    }
  }, [interval]);

  return { loading, data, error, refetch };
};
