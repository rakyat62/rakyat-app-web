import storageKeys from '~/constants/storageKeys'

export default function ({ store, redirect, route }) {
  const token = localStorage.getItem(storageKeys.AUTH_TOKEN)
  if (!token) {
    return redirect('/auth')
  }
}
