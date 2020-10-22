import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const fetch = axios.create();

const END_POINT = process.env.END_POINT;

const getHeaders = ({ withToken = true }) => {
  let headers = {};
  return headers;
};

const getUrl = url => {
  if (url.indexOf('http') === 0) return url;
  return `${END_POINT}${url}`;
};

export const useReq = (
  url,
  {
    params = null,
    method = 'GET',
    headers = {},
    onComplete = null,
    onSuccess = null,
    onError = null,
    skip = false,
    withToken = true,
  } = {}
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const isMountedRef = useRef(null);

  const refetch = (options = {}) => {
    url = getUrl(url);

    setLoading(true);

    fetch
      .get(url, {
        method: method,
        headers: {
          ...getHeaders({ withToken }),
          ...headers,
        },
        params,
        ...options,
      })
      .then(rs => {
        onComplete && onComplete(rs.data);
        if (isMountedRef.current) {
          if (rs.data.error) {
            const err = new Error(rs.data.error);
            err.code = rs.data.code;
            onError && onError(err);
            setLoading(false);
            setError(err);
          } else {
            onSuccess && onSuccess(rs.data);
            setLoading(false);
            setData(rs.data);
          }
        }
      })
      .catch(err => {
        onError && onError(err);
        if (isMountedRef.current) {
          setLoading(false);
          setError(err);
        }
      });
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (skip) return;
    refetch();
    return () => (isMountedRef.current = false);
  }, [JSON.stringify(params), skip]);

  return { loading, data, error, refetch };
};

export default useReq;
