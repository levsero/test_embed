import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import IFrame, { CurrentFrameConsumer } from 'components/Frame'
import { DEFAULT_THEME, ThemeProvider } from '@zendeskgarden/react-theming'
import { getGardenOverrides } from 'component/frame/gardenOverrides'
import { i18n } from 'service/i18n'
import { WidgetThemeProvider } from 'components/Widget'
import HTMLManager from 'embeds/webWidget/components/BaseFrame/HTMLManager'
import {
  FrameStyleConsumer,
  FrameStyleProvider,
  useFrameStyle
} from 'embeds/webWidget/components/BaseFrame/FrameStyleContext'
import { getZoomSizingRatio } from 'utility/devices'
import { FONT_SIZE } from 'constants/shared'

const getBaseFontSize = () => FONT_SIZE * getZoomSizingRatio().toFixed(2) + 'px'

const BaseFrame = ({ children, style, color, visible, ...props }) => {
  const [baseFontSize, setBaseFontSize] = useState(getBaseFontSize())

  useEffect(() => {
    if (visible) {
      setBaseFontSize(getBaseFontSize())
    }
  }, [visible])

  return (
    <FrameStyleProvider>
      <FrameStyleConsumer>
        {frameStyleOverrides => (
          <IFrame
            {...props}
            style={{
              ...style,
              ...frameStyleOverrides.style
            }}
          >
            <CurrentFrameConsumer>
              {frame => (
                <ThemeProvider
                  theme={{
                    ...DEFAULT_THEME,
                    document: frame.document,
                    rtl: i18n.isRTL(),
                    components: getGardenOverrides(color)
                  }}
                >
                  <WidgetThemeProvider>
                    <div id="Embed">
                      <HTMLManager baseFontSize={baseFontSize} />
                      {children}
                    </div>
                  </WidgetThemeProvider>
                </ThemeProvider>
              )}
            </CurrentFrameConsumer>
          </IFrame>
        )}
      </FrameStyleConsumer>
    </FrameStyleProvider>
  )
}

BaseFrame.propTypes = {
  children: PropTypes.node,
  style: PropTypes.objectOf(PropTypes.any),
  onEntered: PropTypes.func,
  visible: PropTypes.bool,
  color: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
}

export default BaseFrame
export { FrameStyleConsumer, useFrameStyle }
