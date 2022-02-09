import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  mutation ($input: UserInput!) {
    authorizationUser(input: $input) {
      login
      token
    }
  }
`;

export const SIGN_UP = gql`
  mutation ($input: UserInput!) {
    addNewUser(input: $input) {
      login
      token
    }
  }
`;
