import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { DEFAULT_THEME, ThemeProvider } from '@zendeskgarden/react-theming'
import { getZoomSizingRatio } from '@zendesk/widget-shared-services'
import IFrame, { CurrentFrameConsumer } from '@zendesk/widget-shared-services/Frame'
import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { getGardenOverrides } from 'classicSrc/component/frame/gardenOverrides'
import { WidgetThemeProvider } from 'classicSrc/components/Widget'
import { FONT_SIZE } from 'classicSrc/constants/shared'
import {
  FrameStyleConsumer,
  FrameStyleProvider,
  useFrameStyle,
} from 'classicSrc/embeds/webWidget/components/BaseFrame/FrameStyleContext'
import HTMLManager from 'classicSrc/embeds/webWidget/components/BaseFrame/HTMLManager'

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
