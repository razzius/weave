// @flow
import { loggedOutNotification } from './persistence'
import { availableForMentoringFromVerifyTokenResponse } from './utils'
import settings from './settings'

// -_-
function addQueryString(url, params: Object) {
  return Object.keys(params).forEach(key => {
    url.searchParams.append(key, String(params[key]))
  })
}

function buildURL(path: string, params: ?Object = null) {
  const url = new URL(`${settings.serverUrl}/${path}`)

  if (params !== null) {
    addQueryString(url, params)
  }
  return url
}

async function http(url, options = {}) {
  const optionsWithAuth = {
    ...options,
    credentials: 'include',
  }

  const response = await fetch(url, optionsWithAuth)

  if (response.status === 440) {
    loggedOutNotification()
    window.location.pathname = '/login'
  }

  if (!response.ok) {
    throw await response.json()
  }

  return response.json()
}

async function get(path, params = null) {
  const url = buildURL(`api/${path}`, params)

  return http(url)
}

async function post(path: string, payload) {
  return http(buildURL(`api/${path}`), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

async function put(path: string, payload) {
  return http(buildURL(`api/${path}`), {
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
  query = '',
  tags = [],
  degrees = [],
  affiliations = [],
  page = 1,
  sorting = 'starred',
}: {
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
  const results = await get('profiles', params)

  return {
    ...results,
    profiles: results.profiles.map(payloadToProfile),
  }
}

export async function getProfile(id: string): Profile {
  const profile = await get(`profiles/${id}`)
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

export async function createProfile(profile: Profile) {
  const payload = profileToPayload(profile)

  return post('profile', payload)
}

export async function updateProfile(profile: Profile, profileId: string) {
  const payload = profileToPayload(profile)

  return put(`profiles/${profileId}`, payload)
}

export async function sendFacultyVerificationEmail({
  email,
  isPersonalDevice,
}: {|
  +email: string,
  +isPersonalDevice: boolean,
|}) {
  return post('send-faculty-verification-email', {
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
  return post('send-student-verification-email', {
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
  return post('login', { email, is_personal_device: isPersonalDevice })
}

export type Account = {|
  +isMentor: boolean,
  +isAdmin: boolean,
  +profileId: string,
  +email: string,
  +availableForMentoring: boolean,
|}

export async function verifyToken(token?: ?string): Promise<Account> {
  const response = await post('verify-token', { token })

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

export async function logout() {
  return post('logout')
}

export async function setAvailabilityForMentoring(available: boolean) {
  return post('availability', { available })
}

export async function uploadPicture(file: File) {
  const url = buildURL('api/upload-image')

  return http(url, {
    method: 'POST',
    body: file,
  })
}

export async function getSearchTags() {
  return get('search-tags')
}

export async function getProfileTags() {
  return get('profile-tags')
}

export async function starProfile(profileId: string) {
  return post('star_profile', { profile_id: profileId })
}

export async function unstarProfile(profileId: string) {
  return post('unstar_profile', { profile_id: profileId })
}
