class SuncoAPIError extends Error {
  constructor(message, payload) {
    super(message)
    this.suncoErrorInfo = payload
  }
}

export default SuncoAPIError
