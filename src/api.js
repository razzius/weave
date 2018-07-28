const serverUrl = process.env.REACT_APP_SERVER_URL

// -_-
function addQueryString(url, params) {
  return Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key])
  })
}

function buildURL(path, params) {
  const url = new URL(`${serverUrl}/${path}`)
  if (params) {
    addQueryString(url, params)
  }
  return url
}

async function http(url, options) {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw await response.json()
  }

  return response.json()
}

async function get(token, path, params = null) {
  const url = buildURL(`api/${path}`, params)

  return http(url, {
    headers: {
      'Authorization': `Token ${token}`,
    },
  })
}

async function post(token, path, payload) {
  return http(buildURL(`api/${path}`, null), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(payload)
  })
}

export async function getProfiles(token, search = null) {
  let params
  if (search !== null) {
    params = {query: search}
  } else {
    params = {}
  }
  return get(token, 'profiles', params)
}

export async function getProfile(token, id) {
  return get(token, `profiles/${id}`)
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

export async function createProfile(token, profile) {
  const payload = profileToPayload(profile)

  return post(token, 'profile', payload)
}

// export async function updateProfile(token, profile) {
//   const payload = profileToPayload(profile)

//   return put(token, 'profile', payload)
// }

export async function sendFacultyVerificationEmail(email) {
  return post(null, 'send-faculty-verification-email', { email })
}

export async function sendStudentVerificationEmail(email) {
  return post(null, 'send-student-verification-email', { email })
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

  return http(url, {
    method: 'POST',
    body: file,
    headers: {
      'Authorization': `Token ${token}`,
    }
  })
}
