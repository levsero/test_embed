const inline = require('inline-source').sync;
const babel = require('babel-core')
const htmlmin = require('htmlmin');
const uglify = require('uglify-js');
const fs = require('fs');

const ver = String(fs.readFileSync('dist/VERSION_HASH')).trim();
const str = fs.readFileSync('./src/cacheBuster/update.js').toString().replace('{{versionHash}}', ver);
const result = babel.transform(uglify.minify(str, { fromString: true }).code);

fs.writeFileSync('./dist/update.js', result.code);

const html = inline('./src/cacheBuster/update.html', {
  ignore: ['css', 'png']
});

fs.writeFile('./dist/update.html', htmlmin(html), function(err) {
  if (err) { console.error(err); }
});
