import superagent from 'superagent'

const validStatus = {
  online: true,
  away: true,
  offline: true,
}

let __prefetchedChatStatus = null

const prefetchChatStatus = async (mediatorHost, zopimId) => {
  __prefetchedChatStatus = new Promise((resolve, reject) => {
    return superagent(
      'GET',
      `https://${mediatorHost}/client/widget/account/status?embed_key=${zopimId}`
    )
      .responseType('json')
      .end((err, result) => {
        if (err || result.status !== 200) {
          __prefetchedChatStatus = null
          reject(err)
        } else {
          resolve({
            success: true,
            chatStatus: result.body,
          })
        }
      })
  })

  return await __prefetchedChatStatus
}

const fetchDeferredChatStatus = async (endpoint) => {
  if (!endpoint) {
    throw new Error('Failed to get deferred chat status, no endpoint specified')
  }

  let response

  if (__prefetchedChatStatus) {
    try {
      const prefetchedStatus = await __prefetchedChatStatus
      if (prefetchedStatus.success) {
        response = { ...prefetchedStatus.chatStatus }
        __prefetchedChatStatus = null
      }
    } catch {
      // fallback to fetching chat status
    }
  }

  response =
    response ||
    (await new Promise((resolve, reject) => {
      superagent('GET', endpoint)
        .responseType('json')
        .end((err, result) => {
          if (err) {
            reject(err)
            return
          }

          if (result.status !== 200) {
            throw new Error(`Unexpected status code, expected 200 got ${result.status}`)
          }

          resolve(result.body)
        })
    }))

  const status = response.status
  const departments =
    response.departments === undefined || response.departments === null ? [] : response.departments

  if (!validStatus[status]) {
    throw new Error(`Got invalid account status from deferred chat endpoint, "${status}"`)
  }

  if (!Array.isArray(departments)) {
    throw new Error(
      `Got invalid departments from deferred chat endpoint, expected array got "${typeof departments}"`
    )
  }

  const departmentsById = departments.reduce(
    (prev, next) => ({
      ...prev,
      [next.id]: next,
    }),
    {}
  )

  return { status, departments: departmentsById }
}

export { prefetchChatStatus, fetchDeferredChatStatus }
