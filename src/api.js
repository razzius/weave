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
  const authHeaders = token
    ? { Authorization: `Token ${token}`, ...existingHeaders }
    : existingHeaders

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

export type Profile = Object
type ProfilePayload = Object

function payloadToProfile(payload: ProfilePayload): Profile {
  return {
    id: payload.id,
    dateUpdated: payload.date_updated,

    name: payload.name,
    contactEmail: payload.contact_email,
    imageUrl: payload.profile_image_url,

    affiliations: payload.affiliations,
    clinicalSpecialties: payload.clinical_specialties,
    professionalInterests: payload.professional_interests,
    partsOfMe: payload.parts_of_me,
    activities: payload.activities,
    degrees: payload.degrees,

    additionalInformation: payload.additional_information,

    willingShadowing: payload.willing_shadowing,
    willingNetworking: payload.willing_networking,
    willingGoalSetting: payload.willing_goal_setting,
    willingDiscussPersonal: payload.willing_discuss_personal,
    willingCareerGuidance: payload.willing_career_guidance,
    willingStudentGroup: payload.willing_student_group,

    cadence: payload.cadence,
    otherCadence: payload.other_cadence,

    starred: payload.starred,
  }
}

export async function getProfiles({
  token,
  query = '',
  tags = [],
  degrees = [],
  affiliations = [],
  page = 1,
  sorting = 'starred',
}: {
  token: string,
  query?: string,
  tags?: Array<string>,
  degrees?: Array<string>,
  affiliations?: Array<string>,
  page: number,
  sorting?: string,
}) {
  const params = {
    page,
    query,
    tags,
    degrees,
    affiliations,
    sorting,
  }
  const results = await get(token, 'profiles', params)

  return {
    ...results,
    profiles: results.profiles.map(payloadToProfile),
  }
}

export async function getProfile(token: string, id: string): Profile {
  const profile = await get(token, `profiles/${id}`)
  return payloadToProfile(profile)
}

export function profileToPayload(profile: Profile): ProfilePayload {
  return {
    name: profile.name,
    contact_email: profile.contactEmail,
    profile_image_url: profile.imageUrl,

    affiliations: profile.affiliations,
    clinical_specialties: profile.clinicalSpecialties,
    professional_interests: profile.professionalInterests,
    parts_of_me: profile.partsOfMe,
    activities: profile.activities,
    degrees: profile.degrees,

    additional_information: profile.additionalInformation,

    willing_shadowing: profile.willingShadowing,
    willing_networking: profile.willingNetworking,
    willing_goal_setting: profile.willingGoalSetting,
    willing_discuss_personal: profile.willingDiscussPersonal,
    willing_career_guidance: profile.willingCareerGuidance,
    willing_student_group: profile.willingStudentGroup,

    cadence: profile.cadence,
    other_cadence: profile.otherCadence,
  }
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

export async function verifyToken(token: string | null): Promise<Account> {
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

export async function getSearchTags(token: string) {
  return get(token, 'search-tags')
}

export async function getProfileTags(token: string) {
  return get(token, 'profile-tags')
}

export async function starProfile(token: string, profileId: string) {
  return post(token, 'star_profile', { profile_id: profileId })
}

export async function unstarProfile(token: string, profileId: string) {
  return post(token, 'unstar_profile', { profile_id: profileId })
}
