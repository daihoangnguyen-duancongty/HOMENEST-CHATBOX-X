// frontend/src/app/graphql/mutations/createEmployee.ts
import { gql } from "@apollo/client";

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($clientId: String!, $username: String!, $name: String!, $avatar: String) {
    clientCreateEmployee(clientId: $clientId, username: $username, name: $name, avatar: $avatar) {
      userId
      username
      name
      avatar
      role
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($userId: ID!) {
    deleteUser(userId: $userId)
  }
`;

export const REACTIVATE_CLIENT = gql`
  mutation ReactivateClient($clientId: String!, $extendMonths: Int!) {
    reactivateClient(clientId: $clientId, extendMonths: $extendMonths) {
      clientId
      active
      trial_end
    }
  }
`;
