import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { DEFAULT_THEME, ThemeProvider } from '@zendeskgarden/react-theming'
import { FONT_SIZE } from 'constants/shared'
import {
  FrameStyleConsumer,
  FrameStyleProvider,
  useFrameStyle,
} from 'embeds/webWidget/components/BaseFrame/FrameStyleContext'
import HTMLManager from 'embeds/webWidget/components/BaseFrame/HTMLManager'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { getGardenOverrides } from 'src/component/frame/gardenOverrides'
import { WidgetThemeProvider } from 'src/components/Widget'
import IFrame, { CurrentFrameConsumer } from 'src/framework/components/Frame'
import { getZoomSizingRatio } from 'utility/devices'

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
        {(frameStyleOverrides) => (
          <IFrame
            {...props}
            style={{
              ...style,
              ...frameStyleOverrides.style,
            }}
          >
            <CurrentFrameConsumer>
              {(frame) => (
                <ThemeProvider
                  theme={{
                    ...DEFAULT_THEME,
                    document: frame.document,
                    rtl: i18n.isRTL(),
                    components: getGardenOverrides(color),
                    colors: {
                      ...DEFAULT_THEME.colors,
                      primaryHue: 'grey',
                    },
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
  color: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
}

export default BaseFrame
export { FrameStyleConsumer, useFrameStyle }
