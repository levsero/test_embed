import React from 'react'
import Launcher from 'src/apps/messenger/features/core/components/Launcher'
import Messenger from 'src/apps/messenger/features/core/components/Messenger'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import tabbable from 'tabbable'

const firstNodes = elementsByContainer => elementsByContainer.map(container => container[0])

const lastNodes = elementsByContainer =>
  elementsByContainer.map(container => container[container.length - 1])

const handleTabbingForFrames = (event, containers) => {
  const { keyCode } = event
  const elementsByContainer = containers.map(container => tabbable(container))

  if (!event.shiftKey && keyCode === KEY_CODES.TAB) {
    const lastNodeIndex = lastNodes(elementsByContainer).indexOf(event.target)
    if (lastNodeIndex > -1) {
      const nextIndex = lastNodeIndex === elementsByContainer.length - 1 ? 0 : lastNodeIndex + 1
      firstNodes(elementsByContainer)[nextIndex].focus()
      event.preventDefault()
    }
  }

  if (event.shiftKey && keyCode === KEY_CODES.TAB) {
    const firstNodeIndex = firstNodes(elementsByContainer).indexOf(event.target)
    if (firstNodeIndex > -1) {
      const prevIndex = firstNodeIndex === 0 ? elementsByContainer.length - 1 : firstNodeIndex - 1
      lastNodes(elementsByContainer)[prevIndex].focus()
      event.preventDefault()
    }
  }
}

const App = () => {
  const refLauncher = React.createRef()
  const refWidget = React.createRef()
  return (
    <div
      onKeyDown={event => {
        const { keyCode } = event
        if (!keyCode === KEY_CODES.TAB) return

        handleTabbingForFrames(event, [refLauncher.current, refWidget.current])
      }}
      role="presentation"
    >
      <Launcher ref={refLauncher} />
      <Messenger ref={refWidget} />
    </div>
  )
}

export default App
