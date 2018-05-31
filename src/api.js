const serverUrl = process.env.REACT_APP_SERVER_URL

function buildURL(path) {
  return new URL(`${window.location.protocol}//${serverUrl}/${path}`)
}

async function http(url, options) {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw await response.json()
  }

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
    profile_image_url: profile.imageUrl,

    additional_interests: profile.additionalInterests,
    affiliations: profile.affiliations,
    clinical_specialties: profile.clinicalSpecialties,
    additional_information: profile.additionalInformation,

    willing_shadowing: profile.willingShadowing,
    willing_networking: profile.willingNetworking,
    willing_goal_setting: profile.willingGoalSetting,
    willing_discuss_personal: profile.willingDiscussPersonal,
    willing_residency_application: profile.willingResidencyApplication,

    cadence: profile.cadence,
    other_cadence: profile.otherCadence
  }

  return http(buildURL("api/profile"), {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  })
}
// todo use auth
// export async function updateProfile(id, profile) {
  // await put(`/api/profiles/${id}`, profile)
// }

export async function uploadPicture(file) {
  const url = buildURL("api/upload-image")

  return http(url, {
    method: 'POST',
    body: file
  })
}
