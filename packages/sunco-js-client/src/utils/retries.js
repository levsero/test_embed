const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const retryWrapper = async (operation, delay, retries) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation()
    } catch (err) {
      await wait(delay)
    }
  }

  return operation()
}

export default retryWrapper
