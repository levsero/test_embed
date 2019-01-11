const rest = require('rest');
const  fs = require('fs');
const localeListPath = __dirname +  '/../src/translation/locales.json';

const generateLocaleList = (locales) => {
  return locales.map((locale) => locale.locale);
};

const writeJson = (localeList) => {
  const contents = JSON.stringify(localeList, null, 2);

  fs.writeFile(localeListPath, contents, { flag: 'w' }, (err) => {
    if (err) throw err;
    console.error('\nlocale list written'); // eslint-disable-line
  });
};

rest('https://support.zendesk.com/api/v2/rosetta/locales/public.json')
  .then(function(res) {
    console.log('\nCreating locales list'); // eslint-disable-line
    const localeList = generateLocaleList(JSON.parse(res.entity).locales);

    writeJson(localeList);
  })
  .catch((err) => {
    console.log('\nFailed to retrieve locales list:', err); // eslint-disable-line
    throw err;
  });
