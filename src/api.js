// @flow
import { clearToken, loggedOutNotification } from './persistence'
import { availableForMentoringFromVerifyTokenResponse } from './utils'
import settings from './settings'

// -_-
function addQueryString(url, params) {
  return Object.keys(params).forEach(key => {
    url.searchParams.append(key, String(params[key]))
  })
}

function buildURL(path, params = null) {
  const url = new URL(`${settings.serverUrl}/${path}`)
  if (params) {
    addQueryString(url, params)
  }
  return url
}

async function http(token, url, options = {}) {
  const existingHeaders = options.headers || {}
  const authHeaders = {
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...existingHeaders,
  }
  const optionsWithAuth = {
    ...options,
    headers: authHeaders,
  }

  const response = await fetch(url, optionsWithAuth)

  if (response.status === 440) {
    clearToken()
    loggedOutNotification()
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
  return http(token, buildURL(`api/${path}`), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

async function put(token, path, payload) {
  return http(token, buildURL(`api/${path}`), {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

function reverseObject(obj) {
  return Object.keys(obj).reduce(
    (result, key) => ({ [obj[key]]: key, ...result }),
    {}
  )
}

const profilePayloadMapping = {
  id: 'id',
  name: 'name',
  contact_email: 'contactEmail',
  profile_image_url: 'imageUrl',

  affiliations: 'affiliations',
  clinical_specialties: 'clinicalSpecialties',
  professional_interests: 'professionalInterests',
  parts_of_me: 'partsOfMe',
  activities: 'activities',
  degrees: 'degrees',

  additional_information: 'additionalInformation',

  willing_shadowing: 'willingShadowing',
  willing_networking: 'willingNetworking',
  willing_goal_setting: 'willingGoalSetting',
  willing_discuss_personal: 'willingDiscussPersonal',
  willing_career_guidance: 'willingCareerGuidance',
  willing_student_group: 'willingStudentGroup',

  cadence: 'cadence',
  other_cadence: 'otherCadence',
}

function payloadToProfile(payload) {
  const mapping = reverseObject(profilePayloadMapping)
  return Object.keys(mapping).reduce(
    (profile, key) => ({
      ...profile,
      [key]: payload[mapping[key]],
    }),
    {}
  )
}

export async function getProfiles({
  token,
  query = '',
  degrees = [],
  affiliations = [],
  page = 1,
}: {
  token: string,
  query?: string,
  degrees?: Array<string>,
  affiliations?: Array<string>,
  page: number,
}) {
  const params = { page, query, degrees, affiliations }
  const results = await get(token, 'profiles', params)

  return {
    ...results,
    profiles: results.profiles.map(payloadToProfile),
  }
}

type Profile = Object

export async function getProfile(token: string, id: string): Profile {
  const profile = await get(token, `profiles/${id}`)
  return payloadToProfile(profile)
}

type ProfilePayload = Object

export function profileToPayload(profile: Profile): ProfilePayload {
  const profilePayload = Object.keys(profilePayloadMapping)
    .filter(key => key !== 'id')
    .reduce(
      (payload, key) => ({
        ...payload,
        [key]: profile[profilePayloadMapping[key]],
      }),
      {}
    )

  // TODO why would this happen?
  // Answer: somehow null got in to the database. Field is currently nullable
  if (profilePayload.additional_information === null) {
    return {
      ...profilePayload,
      additional_information: '',
    }
  }

  return profilePayload
}

export async function createProfile(token: string, profile: Profile) {
  const payload = profileToPayload(profile)

  return post(token, 'profile', payload)
}

export async function updateProfile(
  token: string,
  profile: Profile,
  profileId: string
) {
  const payload = profileToPayload(profile)

  return put(token, `profiles/${profileId}`, payload)
}

export async function sendFacultyVerificationEmail({
  email,
  isPersonalDevice,
}: {|
  +email: string,
  +isPersonalDevice: boolean,
|}) {
  return post(null, 'send-faculty-verification-email', {
    email,
    is_personal_device: isPersonalDevice,
  })
}

export async function sendStudentVerificationEmail({
  email,
  isPersonalDevice,
}: {|
  +email: string,
  +isPersonalDevice: boolean,
|}) {
  return post(null, 'send-student-verification-email', {
    email,
    is_personal_device: isPersonalDevice,
  })
}

export async function sendLoginEmail({
  email,
  isPersonalDevice,
}: {|
  +email: string,
  +isPersonalDevice: boolean,
|}) {
  return post(null, 'login', { email, is_personal_device: isPersonalDevice })
}

export type Account = {|
  +isMentor: boolean,
  +isAdmin: boolean,
  +profileId: string,
  +email: string,
  +availableForMentoring: boolean,
|}

export async function verifyToken(token: string): Promise<Account> {
  const response = await post(null, 'verify-token', { token })

  return {
    isMentor: response.is_mentor,
    isAdmin: response.is_admin,
    profileId: response.profile_id,
    email: response.email,

    availableForMentoring: availableForMentoringFromVerifyTokenResponse(
      response
    ),
  }
}

export async function setAvailabilityForMentoring(
  token: string,
  available: boolean
) {
  return post(token, 'availability', { available })
}

export async function uploadPicture(token: string, file: File) {
  const url = buildURL('api/upload-image')

  return http(token, url, {
    method: 'POST',
    body: file,
  })
}
