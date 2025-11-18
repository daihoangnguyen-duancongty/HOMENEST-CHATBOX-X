// graphql/mutations/createPlan.ts
import { gql } from "@apollo/client";

export const CREATE_PLAN = gql`
  mutation CreatePlan($name: String!, $max_users: Int!) {
    createPlan(name: $name, max_users: $max_users) {
      planId
      name
      max_users
    }
  }
`;

export const UPDATE_PLAN = gql`
  mutation UpdatePlan($planId: ID!, $name: String!, $max_users: Int!) {
    updatePlan(planId: $planId, name: $name, max_users: $max_users) {
      planId
      name
      max_users
    }
  }
`;

export const DELETE_PLAN = gql`
  mutation DeletePlan($planId: ID!) {
    deletePlan(planId: $planId)
  }
`;
