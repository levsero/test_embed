const builddir = 'dist';

function writePopoutFile() {
  const fs = require('fs');

  const code = fs.readFileSync('src/asset/templates/liveChat.html').toString();
  const url = process.env.POPOUT_URL;

  fs.writeFileSync(`${builddir}/liveChat.html`, interpolatedPopoutCode(url, code));
}

function interpolatedPopoutCode(url, code) {
  return code.replace('{{popoutURL}}', url);
}

writePopoutFile();
