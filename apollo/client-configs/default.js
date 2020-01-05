import storageKeys from '../../constants/storageKeys'

export default function (context) {
  return {
    httpEndpoint: process.env.graphqlApiUrl || 'wrongurl.com',
    httpLinkOptions: {
      headers: {
        'Authorization': localStorage.getItem(storageKeys.AUTH_TOKEN)
      }
    }
  }
}
