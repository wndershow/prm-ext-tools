import { GraphQLClient } from 'graphql-request';
const endPoint = process.env.END_POINT;

export default () => {
  const client = new GraphQLClient(endPoint);

  return client;
};
