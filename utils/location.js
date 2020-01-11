import storageKeys from '../constants/storageKeys'

const saveCurrentPosition = ({ lat, lng, timestamp }) => {
  localStorage.setItem(storageKeys.LOCATION_LAT, lat)
  localStorage.setItem(storageKeys.LOCATION_LNG, lng)
  localStorage.setItem(storageKeys.LOCATION_UPDATED_AT, timestamp)
}

export const loadCurrentPosition = () => new Promise((resolve) => {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude
    const lng = position.coords.longitude
    const timestamp = position.timestamp

    saveCurrentPosition({ lat, lng, timestamp })
    resolve({ lat, lng, timestamp })
  })
})

export const getCachedCurrentPosition = () => {
  const lat = parseFloat(localStorage.getItem(storageKeys.LOCATION_LAT))
  const lng = parseFloat(localStorage.getItem(storageKeys.LOCATION_LNG))
  const timestamp = parseFloat(localStorage.getItem(storageKeys.LOCATION_UPDATED_AT))

  return { lat, lng, timestamp }
}
