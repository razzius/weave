const serverUrl = process.env.REACT_APP_SERVER_URL

function buildURL(path) {
  return new URL(`${window.location.protocol}//${serverUrl}/${path}`)
}

async function http(url, options) {
  const response = await fetch(url, options)
  return response.json()
}

export async function getProfiles(query = {}) {
  const url = buildURL("api/profiles")
  Object.keys(query).forEach(key => url.searchParams.append(key, query[key]))
  return http(url)
}

export async function getProfile(id) {
  return http(buildURL(`api/profiles/${id}`))
}

export async function createProfile(profile) {
  const payload = {
    name: profile.name,
    email: profile.email,
    additional_interests: profile.additionalInterests,
    affiliations: profile.affiliations,
    clinical_specialties: profile.clinicalSpecialties,
    additional_information: profile.additionalInformation
  }

  try {
    return await http(buildURL("api/profile"), {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    })
  } catch (e) {
    console.log(e)
    return e
  }
}
// todo use auth
// export async function updateProfile(id, profile) {
  // await put(`/api/profiles/${id}`, profile)
// }

export async function uploadPicture(id, file) {
  const url = buildURL("api/upload-image")

  const data = new FormData()

  data.append('files', file, file.name)
  data.append('user', 'hubot')

  return http(url, {
    method: 'POST',
    body: data
  })
  // serializedData = encode(imageData)
  // const { url } = await uploadImageData(id, imageData)
  // return url
}
