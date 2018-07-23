const serverUrl = process.env.REACT_APP_SERVER_URL

function buildURL(path) {
  return new URL(`${serverUrl}/${path}`)
}

async function http(url, options) {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw await response.json()
  }

  return response.json()
}

export async function getProfiles(search = null) {
  const url = buildURL('api/profiles')
  if (search !== null) {
    url.searchParams.append('query', search)
  }
  return http(url)
}

export async function getProfile(id) {
  return http(buildURL(`api/profiles/${id}`))
}

export function profileToPayload(profile) {
  return {
    name: profile.name,
    contact_email: profile.email,
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
}

async function post(path, payload) {
  return http(buildURL(`api/${path}`), {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}

export async function createProfile(profile) {
  const payload = profileToPayload(profile)

  return post('profile', payload)
}

export async function sendVerificationEmail(email) {
  return post('send-verification-email', { email })
}

export async function verifyToken(token) {
  return post('verify-token', { token })
}

// todo use auth
// export async function updateProfile(id, profile) {
// await put(`/api/profiles/${id}`, profile)
// }

export async function uploadPicture(file) {
  const url = buildURL('api/upload-image')

  return http(url, {
    method: 'POST',
    body: file
  })
}
