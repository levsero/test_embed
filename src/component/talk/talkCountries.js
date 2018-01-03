import _ from 'lodash';

import zECountries from 'translation/ze_countries';

export const countriesByIso = zECountries;

export const countriesByName = _.reduce(zECountries, (result, value, key) => {
  result[value.name] = { code: value.code, iso: key };
  return result;
}, {});
