const fetchLocale = locale => {
  return import(
    /* webpackChunkName: "locales/[request]" */ `src/translation/locales/${locale.toLowerCase()}.json`
  ).catch(() => {})
}

export default fetchLocale
