import storageKeys from '../constants/storageKeys'

export const getCurrentPosition = () => new Promise((resolve) => {
  navigator.geolocation.getCurrentPosition((position) => {
    resolve({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      timestamp: position.timestamp
    })
  })
})

export const saveCurrentPosition = ({ lat, lng, timestamp }) => {
  localStorage.setItem(storageKeys.LOCATION_LAT, lat)
  localStorage.setItem(storageKeys.LOCATION_LNG, lng)
  localStorage.setItem(storageKeys.LOCATION_UPDATED_AT, timestamp)
}
