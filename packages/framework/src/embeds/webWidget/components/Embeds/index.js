import { useDispatch, useSelector } from 'react-redux'
import { FONT_SIZE, DEFAULT_WIDGET_HEIGHT, WIDGET_WIDTH, WIDGET_MARGIN } from 'constants/shared'
import { webWidgetStyles } from 'embed/webWidget/webWidgetStyles'
import BaseFrame from 'embeds/webWidget/components/BaseFrame'
import FrameTransition from 'embeds/webWidget/components/BaseFrame/FrameTransition'
import WebWidget from 'src/component/webWidget/WebWidget'
import FocusJail from 'src/components/FrameFocusJail'
import useTranslate from 'src/hooks/useTranslate'
import { widgetShowAnimationComplete } from 'src/redux/modules/base'
import { getColor, getFrameVisible } from 'src/redux/modules/selectors'
import { getStylingZIndex } from 'src/redux/modules/settings/settings-selectors'
import { generateUserWidgetCSS } from 'utility/color/styles'
import { getZoomSizingRatio, isMobileBrowser } from 'utility/devices'
import { isPopout } from 'utility/globals'

const sizingRatio = FONT_SIZE * getZoomSizingRatio()
const baseFontCSS = `html { font-size: ${sizingRatio}px }`
const webWidgetCSS = `${require('globalCSS')} ${webWidgetStyles}`

const baseWebWidgetStyle = {
  width: WIDGET_WIDTH + 2 * WIDGET_MARGIN,
  maxHeight: `calc(100vh - ${2 * WIDGET_MARGIN}px)`,
  height: DEFAULT_WIDGET_HEIGHT + 2 * WIDGET_MARGIN,
  position: 'fixed',
  opacity: 0,
  border: 0,
}

const mobileWebWidgetStyle = {
  width: '100%',
  height: '100%',
  position: 'fixed',
  opacity: 0,
  border: 0,
  top: 0,
}

const fullscreenDesktopStyle = {
  height: '100%',
  maxHeight: 'none',
  width: '100%',
  maxWidth: '100%',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

// On mobile we don't want to transition the web widget's position
const mobileTransitionOverrides = {
  left: 0,
  bottom: null,
  right: null,
}

const Embeds = () => {
  const translate = useTranslate()
  const dispatch = useDispatch()
  const visible = useSelector((state) => getFrameVisible(state, 'webWidget'))
  const color = useSelector((state) => getColor(state, 'webWidget'))
  const zIndex = useSelector(getStylingZIndex)

  const frameStyle = isMobileBrowser() ? mobileWebWidgetStyle : baseWebWidgetStyle
  if (!isMobileBrowser() && isPopout()) {
    Object.assign(frameStyle, fullscreenDesktopStyle)
  }

  return (
    <FrameTransition
      visible={visible}
      onEntered={() => {
        dispatch(widgetShowAnimationComplete())
      }}
    >
      {(transitionStyles) => (
        <BaseFrame
          title={translate('embeddable_framework.web_widget.frame.title') ?? ''}
          id="webWidget"
          visible={visible}
          style={{
            ...frameStyle,
            ...transitionStyles,
            ...(isMobileBrowser() ? mobileTransitionOverrides : {}),
            zIndex,
          }}
          color={color}
          tabIndex={visible ? '0' : '-1'}
        >
          <style dangerouslySetInnerHTML={{ __html: baseFontCSS }} />
          <style dangerouslySetInnerHTML={{ __html: generateUserWidgetCSS(color) }} />
          <style dangerouslySetInnerHTML={{ __html: webWidgetCSS }} />

          <FocusJail name="webWidget">
            <WebWidget />
          </FocusJail>
        </BaseFrame>
      )}
    </FrameTransition>
  )
}

export default Embeds
