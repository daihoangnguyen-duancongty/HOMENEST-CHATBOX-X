// graphql/queries/getPlans.ts
import { gql } from "@apollo/client";

export const GET_PLANS = gql`
  query {
    plans {
      planId
      name
      max_users
    }
  }
`;
