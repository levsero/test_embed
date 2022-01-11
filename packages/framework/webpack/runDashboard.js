const path = require('path')
const fs = require('fs')
const spawn = require('child_process').spawn

const runDashboard = () => {
  const zendeskCodePath = process.env.ZENDESK_CODE_DIR || path.resolve(__dirname, '../')

  const dashboardPath = path.resolve(zendeskCodePath, 'widget-developer-dashboard')
  const frameworkPath = path.resolve(zendeskCodePath, 'embeddable_framework')

  if (!fs.existsSync(dashboardPath)) {
    throw new Error(
      [
        "You tried to start the widget with the dashboard, but don't have the dashboard installed yet.\n",
        'Installation instructions can be found here https://github.com/zendesk/widget-developer-dashboard\n',
      ].join('')
    )
  }

  const messengerServer = spawn(
    `cd ${frameworkPath} && yarn workspace @zendesk/web-widget-messenger dev`,
    {
      shell: true,
    }
  )

  messengerServer.stdout.on('data', function (data) {
    process.stdout.write(data, ' color: #008080')
  })
  messengerServer.stderr.on('data', function (data) {
    process.stdout.write(data, ' color: #008080')
  })
  const classicServer = spawn(
    `cd ${frameworkPath} && yarn workspace @zendesk/web-widget-classic dev`,
    {
      shell: true,
    }
  )

  classicServer.stdout.on('data', function (data) {
    process.stdout.write(data, 'color: #FFA500')
  })
  classicServer.stderr.on('data', function (data) {
    process.stdout.write(data, 'color: #FFA500')
  })

  const child = spawn(`cd ${dashboardPath} && yarn start`, {
    shell: true,
  })
  child.stdout.on('data', function (data) {
    process.stdout.write(data)
  })
  child.stderr.on('data', function (data) {
    process.stderr.write(data)
  })
}

module.exports = runDashboard
