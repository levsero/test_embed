import { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LauncherLabel as SuncoLauncherLabel } from '@zendesk/conversation-components'
import Frame from '@zendesk/widget-shared-services/Frame'
import { frameMarginFromPage, launcherSize } from 'messengerSrc/constants'
import useTranslate from 'messengerSrc/features/i18n/useTranslate'
import { getLauncherLabelText } from 'messengerSrc/features/launcherLabel/store/config'
import {
  getIsLauncherLabelVisible,
  labelHidden,
} from 'messengerSrc/features/launcherLabel/store/visibility'
import ThemeProvider from 'messengerSrc/features/themeProvider'
import { getPosition } from 'messengerSrc/features/themeProvider/store'
import { getZIndex } from 'messengerSrc/features/themeProvider/store'
import { getIsWidgetOpen, widgetOpened } from 'messengerSrc/store/visibility'
import { Container, GlobalStyles } from './styles'

const roughSizeForBoxShadows = 20

const LauncherLabel = forwardRef((_, ref) => {
  const dispatch = useDispatch()
  const position = useSelector(getPosition)
  const zIndex = useSelector(getZIndex)
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 })
  const isWidgetOpen = useSelector(getIsWidgetOpen)
  const isLauncherLabelVisible = useSelector(getIsLauncherLabelVisible)
  const text = useSelector(getLauncherLabelText)
  const wasVisible = useRef(isLauncherLabelVisible)
  const translate = useTranslate()

  if (isLauncherLabelVisible) {
    wasVisible.current = true
  }

  const refCallback = (element) => {
    if (!element || dimensions?.updated) {
      return ref
    }

    setDimensions?.({
      height: element.clientHeight + roughSizeForBoxShadows * 2,
      width: element.clientWidth + roughSizeForBoxShadows * 2,
      updated: true,
    })

    if (ref) ref.current = element
  }

  useLayoutEffect(() => {
    if (isWidgetOpen && wasVisible.current) {
      dispatch(labelHidden())
    }
  }, [isWidgetOpen])

  if (!isLauncherLabelVisible) {
    return null
  }

  return (
    <Frame
      title={translate('embeddable_framework.messenger.launcher_label.frame.title')}
      style={{
        position: 'fixed',
        bottom: launcherSize + frameMarginFromPage - 12,
        height: dimensions.height,
        width: dimensions.width,
        [position]: 0,
        border: 0,
        zIndex,
      }}
    >
      <ThemeProvider>
        <>
          <GlobalStyles />
          <Container
            ref={refCallback}
            onKeyDown={() => {
              // The focus jail does not pick up onKeyDown if not used at least once.
            }}
            position={position}
          >
            <SuncoLauncherLabel
              position={position}
              closeButtonAriaLabel={translate(
                'embeddable_framework.messenger.launcher_label.close'
              )}
              onCloseClick={() => {
                dispatch(labelHidden())
              }}
              onLabelClick={() => {
                dispatch(widgetOpened())
              }}
              setDimensions={setDimensions}
              dimensions={dimensions}
              text={text}
            />
          </Container>
        </>
      </ThemeProvider>
    </Frame>
  )
})

export default LauncherLabel
