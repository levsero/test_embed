import zELocaleIdMap from './gen/ze_localeIdMap'

function regulateDash(locale) {
  return locale.replace('_', '-')
}

function regulateLocaleStringCase(locale) {
  return locale.toLowerCase()
}

const localeKeyExists = (locale) => {
  return zELocaleIdMap[locale] !== undefined
}

function parseLocale(str, desiredFallback) {
  const fallback = localeKeyExists(desiredFallback) ? desiredFallback : 'en-us'

  if (!str) return fallback

  const locale = regulateLocaleStringCase(regulateDash(str))
  if (localeKeyExists(locale)) {
    return locale
  }

  const extractedLang = locale.substring(0, locale.indexOf('-'))
  if (localeKeyExists(extractedLang)) {
    return extractedLang
  }

  if (str === 'tl') {
    return 'fil'
  }

  if (str.startsWith('zh')) {
    return parseZhLocale(str)
  }

  return fallback
}

// logic taken from https://www.drupal.org/project/drupal/issues/365615
function parseZhLocale(str) {
  str = str.toLowerCase()
  const parts = str.split('-')

  if (parts.length > 2) {
    const middle = parts[1]

    if (middle === 'hant') {
      if (parts[2] === 'mo') {
        return 'zh-mo'
      } else {
        return 'zh-tw'
      }
    } else if (middle === 'hans') {
      if (parts[2] === 'sg') {
        return 'zh-sg'
      } else {
        return 'zh-cn'
      }
    }
  }

  switch (str) {
    case 'zh-cn':
    case 'zh-my':
    case 'zh-hans':
    case 'zh':
      return 'zh-cn'
    case 'zh-hant':
      return 'zh-tw'
    default:
      return 'zh-cn'
  }
}

export default parseLocale
