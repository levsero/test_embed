const fetchLocale = (locale) => {
  return import(
    /* webpackChunkName: "locales/classic/[request]" */ `./gen/translations/${locale.toLowerCase()}.json`
  ).catch(() => {})
}

export default fetchLocale
