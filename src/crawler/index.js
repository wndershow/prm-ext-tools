import base from './base';
export default ({ cid, document }) => {
  const c = Object.assign({}, base);
  c.setDocument(document);
  return c;
};
