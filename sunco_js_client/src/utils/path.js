const normaliseHost = (host = '') => host.replace(/\/$/, '')
const normalisePath = (path = '') => path.replace(/^\/?/, '/')

export const buildUrl = (host, path) => `${normaliseHost(host)}${normalisePath(path)}`
