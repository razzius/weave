const serverUrl = 'localhost:5000'

function buildURL(path) {
  return new URL(`${window.location.protocol}//${serverUrl}/${path}`)
}
async function http(url, options) {
  const response = await fetch(url, options)
  return await response.json()
}

export async function getProfiles(query = {}) {
  const url = buildURL('api/profiles')
  Object.keys(query).forEach(key => url.searchParams.append(key, query[key]))
  return await http(url)
}

export async function getProfile(id) {
  return await http(buildURL(`api/profiles/${id}`))
}

export async function createProfile(data) {
  try{
    return await http(buildURL('api/profile'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  } catch(e) {
    console.log(e)
  }
}
// todo use auth
export async function updateProfile(id, profile) {
  // await put(`/api/profiles/${id}`, profile)
}

export async function uploadPicture(id, imageData) {
  // serializedData = encode(imageData)
  // const { url } = await uploadImageData(id, imageData)
  // return url
}
