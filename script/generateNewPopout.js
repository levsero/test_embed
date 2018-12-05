const builddir = 'dist';

function writePopoutFile() {
  const fs = require('fs');

  const code = fs.readFileSync('src/asset/templates/popout.html').toString();
  const url = process.env.POPOUT_URL;

  fs.writeFileSync(`${builddir}/popout.html`, interpolatedPopoutCode(url, code));
}

function interpolatedPopoutCode(url, code) {
  return code.replace('{{popoutURL}}', url);
}

writePopoutFile();
