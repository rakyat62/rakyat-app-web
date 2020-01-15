import axios from 'axios'

export const uploadFiels = async (files) => {
  const unsignedUploadPreset = 'rakyat62'
  const url = `https://api.cloudinary.com/v1_1/sharofuddin/image/upload`

  const requests = []
  Object.values(files).forEach((img) => {
    const fd = new FormData()
    fd.append('upload_preset', unsignedUploadPreset)
    fd.append('tags', 'rakyat62_browser_upload') // Optional - add tag for image admin in Cloudinary
    fd.append('file', img)
    requests.push(axios.post(url, fd))
  })

  const response = await Promise.all(requests)
  const imagUrls = response.map(res => res.data.secure_url)
  return imagUrls
}
