// src/lib/constants.ts
export const GRAPHQL_URL =
  (process.env.NEXT_PUBLIC_BACKEND_API_URL
    ? process.env.NEXT_PUBLIC_BACKEND_API_URL + "/graphql"
    : "http://localhost:4000/graphql");
