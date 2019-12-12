import superagent from 'superagent'

const validStatus = {
  online: true,
  away: true,
  offline: true
}

const fetchDeferredChatStatus = async endpoint => {
  if (!endpoint) {
    throw new Error('Failed to get deferred chat status, no endpoint specified')
  }

  const response = await new Promise((resolve, reject) => {
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
  })

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
      [next.id]: next
    }),
    {}
  )

  return { status, departments: departmentsById }
}

export { fetchDeferredChatStatus }