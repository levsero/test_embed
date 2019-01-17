import enTranslation from './en-us.json';

const t = (key) => {
  return enTranslation.locale.translations[key];
};

t.load = (_locale, cb) => cb();

t.dir = 'ltr';
module.exports = t;
