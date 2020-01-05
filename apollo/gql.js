import gql from 'graphql-tag'

export const queryIncidents = gql`{
  incidentLabels {
    id
    name
    icon
  }
  incidents {
    id
    information
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
