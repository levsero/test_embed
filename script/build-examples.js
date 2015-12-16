const inline = require('inline-source').sync;
const glob = require('glob');
const fs = require('fs');

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
      'zendeskHost': 'dev.zd-dev.com'
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
