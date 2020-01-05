import storageKeys from '../constants/storageKeys'
import { getCurrentPosition } from '../utils/location'

export default async () => {
  const { lat, lng, timestamp } = await getCurrentPosition()
  console.log('location', lat, lng, timestamp)

  localStorage.setItem(storageKeys.LOCATION_LAT, lat)
  localStorage.setItem(storageKeys.LOCATION_LNG, lng)
  localStorage.setItem(storageKeys.LOCATION_UPDATED_AT, timestamp)
}
