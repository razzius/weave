async function getProfiles(query) {
  return await fetch('/api/profiles', query)
}

// todo use auth
async function updateProfile(id, profile) {
  await put(`/api/profiles/${id}`, profile)
}

async function uploadPicture(id, imageData) {
  serializedData = encode(imageData)
  const { url } = await uploadImageData(id, imageData)
  return url
}
