import gql from 'graphql-tag'

export const queryIncidentsMinimumFields = gql`{
  incidents {
    id
    status
    label {
      name
    }
    createdBy {
      username
    }
    createdAt
  }
}`

export const queryIncidentLabels = gql`{
  incidentLabels {
    id
    name
    icon
  }
}`

export const mutationCreateIncident = gql`mutation($information: String!, $lat: Float!, $lng: Float!, $label: Int!) {
  createIncident(input: {
    information: $information
    locationLat: $lat
    locationLng: $lng
    label: $label
  }) {
    id
    information
    locationLat
    locationLng
    createdBy {
      username
    }
  }
}`

export const mutationLogin = gql`mutation($username: String!, $password: String!) {
  login(input: {
    username: $username
    password: $password
  }) {
    token
    user {
      username
      email
    }
  }
}`
