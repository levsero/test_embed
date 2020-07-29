import tabbable from 'tabbable'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import React from 'react'

const firstNodes = elementsByContainer => elementsByContainer.map(container => container[0])

const lastNodes = elementsByContainer =>
  elementsByContainer.map(container => container[container.length - 1])

const useFocusJail = () => {
  const refLauncher = React.createRef()
  const refWidget = React.createRef()

  const onKeyDownForContainer = event => {
    const { keyCode } = event
    if (!keyCode === KEY_CODES.TAB) return
    const containers = [refLauncher.current, refWidget.current].filter(el => el != null)
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

  return {
    refLauncher,
    refWidget,
    onKeyDownForContainer
  }
}

export { useFocusJail }
