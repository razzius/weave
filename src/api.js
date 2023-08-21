// @flow
import loggedOutNotification from './loggedOutNotification'
import { availableForMentoringFromVerifyTokenResponse } from './utils'

// -_-
function addQueryString(url, params: Object) {
  return Object.keys(params).forEach((key) => {
    url.searchParams.append(key, String(params[key]))
  })
}

function buildURL(path: string, params: ?Object = null) {
  const url = new URL(`/${path}`, window.location.origin)

  if (params !== null) {
    addQueryString(url, params)
  }
  return url
}

async function http(url, options = {}) {
  const optionsWithAuth = {
    ...options,
    credentials: 'include',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  }

  const response = await fetch(url, optionsWithAuth)

  if (response.status === 440) {
    loggedOutNotification()
    window.location.pathname = '/login'
  }

  if (!response.ok) {
    throw response
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
    body: JSON.stringify(payload),
  })
}

async function put(path: string, payload) {
  return http(buildURL(`api/${path}`), {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export type Profile = Object
type ProfilePayload = Object

function payloadToProfile(payload: ProfilePayload): Profile {
  return {
    id: payload.id,
    dateUpdated: new Date(payload.date_updated),

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

function payloadToStudentProfile(payload: Object): Object {
  return {
    id: payload.id,
    dateUpdated: new Date(payload.date_updated),

    name: payload.name,
    contactEmail: payload.contact_email,
    imageUrl: payload.profile_image_url,

    affiliations: payload.affiliations,
    clinicalSpecialties: payload.clinical_specialties,
    professionalInterests: payload.professional_interests,
    partsOfMe: payload.parts_of_me,
    activities: payload.activities,

    program: payload.program,
    pceSite: payload.pce_site,
    currentYear: payload.current_year,

    additionalInformation: payload.additional_information,

    willingDualDegrees: payload.willing_dual_degrees,
    willingAdviceClinicalRotations: payload.willing_advice_clinical_rotations,
    willingDiscussPersonal: payload.willing_discuss_personal,
    willingResearch: payload.willing_research,
    willingResidency: payload.willing_residency,
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

export async function getPeerProfiles({
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
  const results = await get('peer-profiles', params)

  return {
    ...results,
    profiles: results.profiles.map(payloadToStudentProfile),
  }
}

export async function getFacultyProfile(id: string): Profile {
  const profile = await get(`profiles/${id}`)
  return payloadToProfile(profile)
}

export async function getStudentProfile(id: string): Profile {
  const profile = await get(`student-profiles/${id}`)
  return payloadToStudentProfile(profile)
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

export function profileToStudentPayload(profile: Object): Object {
  return {
    name: profile.name,
    contact_email: profile.contactEmail,
    profile_image_url: profile.imageUrl,

    affiliations: profile.affiliations,
    clinical_specialties: profile.clinicalSpecialties,
    professional_interests: profile.professionalInterests,
    parts_of_me: profile.partsOfMe,
    activities: profile.activities,

    program: profile.program,
    pce_site: profile.pceSite,
    current_year: profile.currentYear,

    additional_information: profile.additionalInformation,

    willing_dual_degrees: profile.willingDualDegrees,
    willing_advice_clinical_rotations: profile.willingAdviceClinicalRotations,
    willing_discuss_personal: profile.willingDiscussPersonal,
    willing_research: profile.willingResearch,
    willing_residency: profile.willingResidency,
    willing_student_group: profile.willingStudentGroup,

    cadence: profile.cadence,
    other_cadence: profile.otherCadence,
  }
}

export async function createProfile(profile: Profile) {
  const payload = profileToPayload(profile)

  return post('profile', payload)
}

export async function createStudentProfile(profile: Profile) {
  const payload = profileToStudentPayload(profile)

  return post('student-profile', payload)
}

export async function updateFacultyProfile(
  profile: Profile,
  profileId: string
) {
  const payload = profileToPayload(profile)

  return put(`profiles/${profileId}`, payload)
}

export async function updateStudentProfile(profile: Object, profileId: string) {
  const payload = profileToStudentPayload(profile)

  return put(`student-profiles/${profileId}`, payload)
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

function accountResponseToAccount(response): Account {
  return {
    isMentor: response.is_faculty,
    isAdmin: response.is_admin,
    profileId: response.profile_id,
    email: response.email,

    availableForMentoring:
      availableForMentoringFromVerifyTokenResponse(response),
  }
}

export async function getAccount(): Promise<Account | null> {
  try {
    const response = await get('account')

    return accountResponseToAccount(response)
  } catch (e) {
    if (e.status === 440 && (await e.json()).token[0] === 'expired') {
      loggedOutNotification()

      window.location.pathname = '/login'
    }
    return null
  }
}

export async function verifyToken(token?: ?string): Promise<Account> {
  const response = await post('verify-token', { token })

  return accountResponseToAccount(response)
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

export async function getFacultySearchTags() {
  return get('faculty-search-tags')
}

export async function getStudentSearchTags() {
  return get('student-search-tags')
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
