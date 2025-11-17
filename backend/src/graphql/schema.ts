export default `#graphql
  type Client {
    clientId: String!
    name: String!
    user_count: Int
    active: Boolean
  }

  type Query {
    clients: [Client]
    client(clientId: String!): Client
  }

  type Mutation {
    createClient(name: String!, clientId: String!): Client
  }
`;
