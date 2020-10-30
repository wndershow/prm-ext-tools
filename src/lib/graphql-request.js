import { GraphQLClient } from 'graphql-request';
const endPoint = process.env.END_POINT;
const client = new GraphQLClient(endPoint);

export default client;

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
