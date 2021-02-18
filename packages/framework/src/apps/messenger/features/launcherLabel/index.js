import React, { useLayoutEffect, useRef, useState } from 'react'
import { frameMarginFromPage, launcherSize } from 'src/apps/messenger/constants'
import { useDispatch, useSelector } from 'react-redux'
import { getPosition } from 'src/apps/messenger/features/themeProvider/store'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'

import { getZIndex } from 'src/apps/messenger/features/themeProvider/store'
import Frame from 'src/framework/components/Frame'
import ThemeProvider from 'src/apps/messenger/features/themeProvider'
import { getIsWidgetOpen, widgetOpened } from 'src/apps/messenger/store/visibility'
import {
  getIsLauncherLabelVisible,
  labelHidden,
} from 'src/apps/messenger/features/launcherLabel/store/visibility'
import { getLauncherLabelText } from 'src/apps/messenger/features/launcherLabel/store/config'
import { Container } from 'src/apps/messenger/features/launcherLabel/styles'
import {
  Content,
  Label,
  CloseButton,
  Tail,
  CloseIcon,
  GlobalStyles,
  TriangleShadow,
} from './styles'

const roughSizeForBoxShadows = 20

const LauncherLabel = React.forwardRef((_, ref) => {
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
            ref={ref}
            onKeyDown={() => {
              // The focus jail does not pick up onKeyDown if not used at least once.
            }}
          >
            <Content
              ref={(ref) => {
                if (!ref || dimensions.updated) {
                  return
                }

                setDimensions({
                  height: ref.clientHeight + roughSizeForBoxShadows * 2,
                  width: ref.clientWidth + roughSizeForBoxShadows * 2,
                  updated: true,
                })
              }}
              position={position}
            >
              <CloseButton
                onClick={() => {
                  dispatch(labelHidden())
                }}
                tabIndex={position === 'right' ? 1 : 2}
                position={position}
                aria-label={translate('embeddable_framework.messenger.launcher_label.close')}
              >
                <CloseIcon />
              </CloseButton>
              <Label
                onClick={() => {
                  dispatch(widgetOpened())
                }}
                tabIndex={position === 'left' ? 1 : 2}
              >
                {text}
                <TriangleShadow position={position} />
                <Tail position={position} />
              </Label>
            </Content>
          </Container>
        </>
      </ThemeProvider>
    </Frame>
  )
})

export default LauncherLabel
