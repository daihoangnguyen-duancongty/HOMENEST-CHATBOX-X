// graphql/queries/getUsers.ts
import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query {
    users {
      userId
      name
      username
      role
    }
  }
`;
