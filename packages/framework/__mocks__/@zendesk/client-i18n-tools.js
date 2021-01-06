import enTranslation from './en-us.json'

const t = key => {
  return enTranslation.locale.translations[key]
}

t.dateTimeFormat = options => {
  return {
    options,
    format: input => String(input)
  }
}

t.load = (_locale, cb) => cb()
t.locale = 'en-US'
t.dir = 'ltr'
t.getLocale = () => 'en-US'
module.exports = t
