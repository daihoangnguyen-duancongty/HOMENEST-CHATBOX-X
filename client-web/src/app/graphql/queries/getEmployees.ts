// frontend/src/app/graphql/queries/getEmployees.ts
import { gql } from "@apollo/client";

export const GET_EMPLOYEES = gql`
  query GetEmployees($clientId: String!) {
    employees(clientId: $clientId) {
      userId
      name
      username
      avatar
      role
    }
  }
`;
