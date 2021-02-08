import enTranslation from './en-us.json'

const t = jest.requireActual('@zendesk/client-i18n-tools')
t.set(enTranslation.locale)
module.exports = t
