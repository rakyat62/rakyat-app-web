import { getCurrentPosition, saveCurrentPosition } from '../utils/location'

export default async () => {
  const { lat, lng, timestamp } = await getCurrentPosition()
  console.log('location', lat, lng, timestamp)
  saveCurrentPosition({ lat, lng, timestamp })
}
