export default `#graphql
  type Client {
    clientId: String!
    name: String!
    user_count: Int
    active: Boolean
  }

  type User {
    userId: ID!
    name: String!
    role: String!
    clientId: String
    avatar: String
  }

  type LoginResponse {
    token: String!
    user: User!
  }

  type Query {
    clients: [Client]
    client(clientId: String!): Client
  }

  type Mutation {
    createClient(name: String!, clientId: String!): Client
    loginUser(clientId: String!, username: String!, password: String!): LoginResponse
  }
`;
