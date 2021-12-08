const fetchLocale = (locale) => {
  return import(
    /* webpackChunkName: "locales/classic/[request]" */ `src/translation/classic/${locale.toLowerCase()}.json`
  ).catch(() => {})
}

export default fetchLocale
