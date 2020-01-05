import storageKeys from '../../constants/storageKeys'

export default function (context) {
  return {
    httpEndpoint: process.env.graphqlApiUrl || 'wrongurl.com',
    getAuth: () => `Bearer ${localStorage.getItem(storageKeys.AUTH_TOKEN)}`
  }
}
