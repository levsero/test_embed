const path = require('path')
const fs = require('fs')
const spawn = require('child_process').spawn

let running = false

function DashboardPlugin() {
  const zendeskCodePath = process.env.ZENDESK_CODE_DIR || path.resolve(__dirname, '../')

  const dashboardPath = path.resolve(zendeskCodePath, 'widget-developer-dashboard')

  if (!fs.existsSync(dashboardPath)) {
    throw new Error(
      [
        "You tried to start the widget with the dashboard, but don't have the dashboard installed yet.\n",
        'Installation instructions can be found here https://github.com/zendesk/widget-developer-dashboard\n'
      ].join('')
    )
  }

  return compiler => {
    compiler.plugin('compilation', () => {
      if (running) {
        return
      }
      running = true

      const child = spawn(`cd ${dashboardPath} && yarn start`, {
        shell: true
      })
      child.stdout.on('data', function(data) {
        process.stdout.write(data)
      })
      child.stderr.on('data', function(data) {
        process.stderr.write(data)
      })
    })
  }
}

module.exports = DashboardPlugin
