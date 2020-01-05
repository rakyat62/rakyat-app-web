import storageKeys from '../constants/storageKeys'

export default () => {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log('location', position)
    localStorage.setItem(storageKeys.LOCATION_LAT, position.coords.latitude)
    localStorage.setItem(storageKeys.LOCATION_LNG, position.coords.longitude)
    localStorage.setItem(storageKeys.LOCATION_UPDATED_AT, position.timestamp)
  })
}
