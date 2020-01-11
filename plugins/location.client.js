import { loadCurrentPosition } from '../utils/location'

export default async () => {
  const { lat, lng, timestamp } = await loadCurrentPosition()
  console.log('location', lat, lng, timestamp)
}
