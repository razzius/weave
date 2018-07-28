const serverUrl = process.env.REACT_APP_SERVER_URL

function buildURL(path) {
  return new URL(`${serverUrl}/${path}`)
}

async function http(token, url, options) {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw await response.json()
  }

  return response.json()
}

export async function getProfiles(token, search = null) {
  const url = buildURL('api/profiles')
  if (search !== null) {
    url.searchParams.append('query', search)
  }
  return http(token, url)
}

export async function getProfile(token, id) {
  return http(token, buildURL(`api/profiles/${id}`))
}

export function profileToPayload(profile) {
  return {
    name: profile.name,
    contact_email: profile.contactEmail,
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

async function post(token, path, payload) {
  return http(token, buildURL(`api/${path}`), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(payload)
  })
}

export async function createProfile(token, profile) {
  const payload = profileToPayload(profile)

  return post(token, 'profile', payload)
}

// export async function updateProfile(token, profile) {
//   const payload = profileToPayload(profile)

//   return put(token, 'profile', payload)
// }

export async function sendFacultyVerificationEmail(token, email) {
  return post(token, 'send-faculty-verification-email', { email })
}

export async function sendStudentVerificationEmail(token, email) {
  return post(token, 'send-student-verification-email', { email })
}

export async function sendLoginEmail(email) {
  return post(null, 'login', { email })
}

export async function verifyToken(token) {
  return post(null, 'verify-token', { token })
}

export async function setAvailabilityForMentoring(token, available) {
  return post(token, 'availability', { available })
}


export async function uploadPicture(token, file) {
  const url = buildURL('api/upload-image')

  return http(token, url, {
    method: 'POST',
    body: file
  })
}
