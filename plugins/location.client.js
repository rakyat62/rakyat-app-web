export default () => {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log('location', position)
  })
}
