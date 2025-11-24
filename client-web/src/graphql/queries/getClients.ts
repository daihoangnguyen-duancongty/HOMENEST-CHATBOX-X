// graphql/queries/getClients.ts
import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query {
    clients {
      clientId
      name
      active
      user_count
    }
  }
`;
