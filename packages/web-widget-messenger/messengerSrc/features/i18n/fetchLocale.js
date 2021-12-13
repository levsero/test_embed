const fetchLocale = (locale) => {
  return import(
    /* webpackChunkName: "locales/messenger/[request]" */ `src/translation/messenger/${locale.toLowerCase()}.json`
  ).catch(() => {})
}

export default fetchLocale
