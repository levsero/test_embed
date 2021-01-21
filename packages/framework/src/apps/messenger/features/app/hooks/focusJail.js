import { useRef, useEffect } from 'react'
import tabbable from 'tabbable'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import { useSelector } from 'react-redux'
import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
import { getIsLauncherLabelVisible } from 'src/apps/messenger/features/launcherLabel/store'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'

const firstNodes = elementsByContainer => elementsByContainer.map(container => container[0])

const lastNodes = elementsByContainer =>
  elementsByContainer.map(container => container[container.length - 1])

const useFocusJail = () => {
  const isOpen = useSelector(getIsWidgetOpen)
  const isLauncherLabelVisible = useSelector(getIsLauncherLabelVisible)
  const translate = useTranslate()
  const refLauncher = useRef()
  const refWidget = useRef()
  const refLauncherLabel = useRef()
  const hasRendered = useRef(false)

  useEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true
      return
    }

    if (!isOpen) {
      setTimeout(() => {
        if (!refLauncher.current) {
          return
        }

        refLauncher.current
          .querySelector(
            `[aria-label="${translate('embeddable_framework.messenger.launcher.button')}"]`
          )
          ?.focus()
      }, 0)
    }
  }, [isOpen])

  const onKeyDownForContainer = event => {
    const { keyCode } = event

    if (!isOpen && !isLauncherLabelVisible) {
      return
    }

    if (!keyCode === KEY_CODES.TAB) return

    const containers = [refLauncher.current, refLauncherLabel.current, refWidget.current].filter(
      el => el != null
    )
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
    refLauncherLabel,
    onKeyDownForContainer
  }
}

export { useFocusJail }
