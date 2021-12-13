const fetchLocale = (locale) => {
  return import(
    /* webpackChunkName: "locales/messenger/[request]" */ `./gen/translations/${locale.toLowerCase()}.json`
  ).catch(() => {})
}

export default fetchLocale
