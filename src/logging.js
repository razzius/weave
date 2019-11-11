const logging = (context = {}) => ({
  child(additionalContext) {
    return logging({ ...context, ...additionalContext })
  },
  log(message) {
    const fields = {
      ...context,
      message,
      timestamp: new Date().toISOString(),
    }
    console.log(JSON.stringify(fields))
  },
})

export default logging
