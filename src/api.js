import { clearToken } from "./persistence";

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

async function http(token, url, options = {}) {
  const existingHeaders = options.headers || {}
  const authHeaders = {
    Authorization: `Token ${token}`,
    ...existingHeaders
  }
  const optionsWithAuth = {
    ...options,
    headers: authHeaders
  }

  const response = await fetch(url, optionsWithAuth)

  if (response.status === 401) {
    clearToken()
    alert(
      'For your security, you have been logged out due to reaching a maximum time of 1 hour since initial log in. You may log in again.'
    )
    window.location.pathname = '/login'
  }

  if (!response.ok) {
    throw await response.json()
  }

  return response.json()
}

async function get(token, path, params = null) {
  const url = buildURL(`api/${path}`, params)

  return http(token, url)
}

async function post(token, path, payload) {
  return http(token, buildURL(`api/${path}`, null), {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}

async function put(token, path, payload) {
  return http(token, buildURL(`api/${path}`, null), {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}

export async function getProfiles(token, search = null) {
  let params
  if (search !== null) {
    params = { query: search }
  } else {
    params = {}
  }
  return get(token, 'profiles', params)
}

export async function getProfile(token, id) {
  return get(token, `profiles/${id}`)
}

const profilePayloadMapping = {
  name: 'name',
  contact_email: 'contactEmail',
  profile_image_url: 'imageUrl',

  affiliations: 'affiliations',
  clinical_specialties: 'clinicalSpecialties',
  professional_interests: 'professionalInterests',
  parts_of_me: 'partsOfMe',
  activities: 'activities',

  additional_information: 'additionalInformation',

  willing_shadowing: 'willingShadowing',
  willing_networking: 'willingNetworking',
  willing_goal_setting: 'willingGoalSetting',
  willing_discuss_personal: 'willingDiscussPersonal',
  willing_career_guidance: 'willingCareerGuidance',
  willing_student_group: 'willingStudentGroup',

  cadence: 'cadence',
  other_cadence: 'otherCadence'
}

export function profileToPayload(profile) {
  return Object.keys(profilePayloadMapping).reduce(
    (payload, key) => ({
      ...payload,
      [key]: profile[profilePayloadMapping[key]]
    }),
    {}
  )
}

function reverseObject(obj) {
  return Object.keys(obj).reduce(
    (result, key) => ({ [obj[key]]: key, ...result }),
    {}
  )
}

export function payloadToProfile(payload) {
  const mapping = reverseObject(profilePayloadMapping)
  return Object.keys(mapping).reduce(
    (profile, key) => ({
      ...profile,
      [key]: payload[mapping[key]]
    }),
    {}
  )
}

export async function createProfile(token, profile) {
  const payload = profileToPayload(profile)

  return post(token, 'profile', payload)
}

export async function updateProfile(token, profile, profileId) {
  const payload = profileToPayload(profile)

  return put(token, `profiles/${profileId}`, payload)
}

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

  return http(token, url, {
    method: 'POST',
    body: file
  })
}
