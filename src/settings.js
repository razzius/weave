function getEnv(name, defaultValue) {
  const value = process.env[name]
  if (value !== undefined) {
    if (defaultValue !== undefined) {
      return defaultValue.constructor(value)
    }
    return value
  }
  if (defaultValue === undefined) {
    throw new Error(`Missing environment variable ${name}`)
  }
  return defaultValue
}

export default {
  maxTokenAgeHours: getEnv('REACT_APP_TOKEN_EXPIRY_AGE_HOURS', 1),
}
