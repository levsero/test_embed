import React from 'react'
import ReactDOM from 'react-dom'
import hostPageWindow from 'src/framework/utils/hostPageWindow'
import App from 'src/embeddables/messenger/features/core/components/App'

const run = () => {
  const element = hostPageWindow.document.body.appendChild(
    hostPageWindow.document.createElement('div')
  )

  ReactDOM.render(<App />, element)
}

export default {
  run
}
