const validStatus = {
  online: true,
  away: true,
  offline: true
}

const fetchDeferredChatStatus = async endpoint => {
  if (!endpoint) {
    throw new Error('Failed to get deferred chat status, no endpoint specified')
  }

  const response = await fetch(endpoint)
    .then(res => {
      if (res.status !== 200) {
        throw new Error(`Unexpected status code, expected 200 got ${res.status}`)
      }
      return res
    })
    .then(res => res.json())

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
