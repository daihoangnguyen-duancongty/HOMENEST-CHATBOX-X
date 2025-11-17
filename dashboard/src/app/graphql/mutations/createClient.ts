// graphql/mutations/createClient.ts
import { gql } from "@apollo/client";

export const CREATE_CLIENT = gql`
  mutation CreateClient($name: String!) {
    createClient(name: $name) {
      clientId
      name
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($clientId: ID!, $name: String!, $active: Boolean!) {
    updateClient(clientId: $clientId, name: $name, active: $active) {
      clientId
      name
      active
    }
  }
`;

export const DELETE_CLIENT = gql`
  mutation DeleteClient($clientId: ID!) {
    deleteClient(clientId: $clientId)
  }
`;
