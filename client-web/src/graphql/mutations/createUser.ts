// graphql/mutations/createUser.ts
import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($clientId: String!, $name: String!, $username: String!, $role: String!) {
    createUser(clientId: $clientId, name: $name, username: $username, role: $role) {
      userId
      name
      username
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId)
  }
`;
