import { gql } from 'graphql-request';
import gc from '@/lib/graphql-request';

export const getCompetitorById = async id => {
  let rs = await gc().request(
    gql`
      query getCompetitor($id: Int!) {
        node(id: $id) {
          competitor {
            id
            name
            url
            country
            crawler
          }
        }
      }
    `,
    { id }
  );
  const row = (rs && rs.node && rs.node.competitor) || null;
  return row;
};

export const getCsInfo = async csId => {
  let rs = await gc().request(
    gql`
      query cs($id: Int!) {
        node(id: $id) {
          cs {
            id
            cid
            sid
            cantAutoComplete
            oType
            urlPath
            visitUrl
            country
            status
            name
            domain
            coupons {
              id
              tid
              type
              status
              code
              title
              url
              description
              expireAt
              usedNum
              isValid
            }
          }
        }
      }
    `,
    { id: csId }
  );
  const row = (rs && rs.node && rs.node.cs) || {};
  return row;
};

export const saveData = async ({ coupons, domain, csId }) => {
  let rs = await gc().request(
    gql`
      mutation saveCsCoupons($data: JSON!) {
        saveCsCoupons(data: $data)
      }
    `,
    { data: { coupons, domain, csId } }
  );
  const row = (rs && rs.node && rs.node.competitor) || null;
  return row;
};
