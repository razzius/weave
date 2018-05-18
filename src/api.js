const serverUrl = "frozen-journey-66437.herokuapp.com"

function buildURL(path) {
  return new URL(`${window.location.protocol}//${serverUrl}/${path}`)
}
async function http(url, options) {
  const response = await fetch(url, options)
  return await response.json()
}

export async function getProfiles(query = {}) {
  const url = buildURL("api/profiles")
  Object.keys(query).forEach(key => url.searchParams.append(key, query[key]))
  return await http(url)
}

export async function getProfile(id) {
  return await http(buildURL(`api/profiles/${id}`))
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
