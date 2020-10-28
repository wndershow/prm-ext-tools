export const getQuery = (name, href = '') => {
  const t = href ? href : window.location.href;
  const parseUrl = new URL(t);
  const value = parseUrl.searchParams.get(name) || '';
  return value;
};

export const getHostname = (href = '') => {
  const t = href ? href : window.location.href;
  const parseUrl = new URL(t);
  return parseUrl.hostname;
};

export const getCurrentUrlPath = (href = '') => {
  const t = href ? href : window.location.href;
  const parseUrl = new URL(t);
  return parseUrl.origin + parseUrl.pathname;
};
