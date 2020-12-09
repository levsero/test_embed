const path = require('path')

const builddir = path.resolve(__dirname, '../dist/public')

function writePopoutFile() {
  const fs = require('fs')

  const code = fs
    .readFileSync(path.resolve(__dirname, '../src/asset/templates/liveChat.html'))
    .toString()
  const url = process.env.POPOUT_URL

  fs.mkdirSync(builddir, { recursive: true })
  fs.writeFileSync(`${builddir}/liveChat.html`, interpolatedPopoutCode(url, code))
}

function interpolatedPopoutCode(url, code) {
  return code.replace('{{popoutURL}}', url)
}

writePopoutFile()
