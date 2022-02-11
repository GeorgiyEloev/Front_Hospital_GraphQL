import { gql } from "@apollo/client";

export const GET_ALL_RECORDS = gql`
  query {
    getAllRecords {
      _id
      patient
      doctor
      date
      symptoms
    }
  }
`;

export const ADD_NEW_RECORD = gql`
  mutation ($input: RecordInput!) {
    addNewRecord(input: $input) {
      _id
      patient
      doctor
      date
      symptoms
    }
  }
`;

export const DELETE_RECORD = gql`
  mutation ($id: ID!) {
    removeRecord(_id: $id) {
      _id
      patient
      doctor
      date
      symptoms
    }
  }
`;

export const CHANGE_RECORD = gql`
  mutation ($input: RecordChange!) {
    changeRecord(input: $input) {
      _id
      patient
      doctor
      date
      symptoms
    }
  }
`;
