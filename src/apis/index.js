import { gql } from 'graphql-request';
import gc from '@/lib/graphql-request';

export const getCompetitorById = async (id) => {
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

export const getCouponsByCsId = async (csId) => {
  let rs = await gc().request(
    gql`
      query getCouponsByCsId($csId: Int!) {
        getCouponsByCsId(csId: $csId) {
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
    `,
    { csId }
  );
  const rows = (rs && rs.getCouponsByCsId) || [];
  return rows;
};
