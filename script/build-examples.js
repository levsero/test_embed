const appRoot = require('app-root-path');
const fs = require('fs');
const inline = require('inline-source').sync;
const glob = require('glob');
const confPath = appRoot + process.argv[3];
const watchConfPath = fs.existsSync(confPath) ? confPath : appRoot + '/config/.watch.example';

require('dotenv').config({ path: watchConfPath });

glob('./example/*-template.html', function(err, files) {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach(function(file) {
    const html = inline(file, {
      ignore: ['css', 'png']
    });
    const replaceMap = {
      'zendeskFrameworkUrl': '/dist/main.js',
      'zendeskHost': process.env.WATCH_SUBDOMAIN,
      'zopimId': process.env.WATCH_ZOPIM_ID
    };
    const resultHtml = html.replace(/{{(\w+)}}/g, function(match, key) {
      return replaceMap[key];
    });
    const newFileName = file.replace('-template', '');

    fs.writeFile(newFileName, resultHtml, function(err) {
      if (err) {
        console.error(err);
      }
    });
  });
});
