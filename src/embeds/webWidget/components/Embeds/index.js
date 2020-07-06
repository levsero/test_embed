import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getColor, getFrameVisible } from 'src/redux/modules/selectors'
import FrameTransition from 'embeds/webWidget/components/BaseFrame/FrameTransition'
import BaseFrame from 'embeds/webWidget/components/BaseFrame'
import { getZoomSizingRatio, isMobileBrowser } from 'utility/devices'
import WebWidget from 'component/webWidget/WebWidget'
import { FONT_SIZE, MAX_WIDGET_HEIGHT, WIDGET_WIDTH } from 'constants/shared'
import { generateUserWidgetCSS } from 'utility/color/styles'
import { webWidgetStyles } from 'embed/webWidget/webWidgetStyles'
import FocusJail from 'components/FrameFocusJail'
import { widgetShowAnimationComplete } from 'src/redux/modules/base'
import { getStylingZIndex } from 'src/redux/modules/settings/settings-selectors'
import useTranslate from 'src/hooks/useTranslate'
import { isPopout } from 'utility/globals'

const sizingRatio = FONT_SIZE * getZoomSizingRatio()
const baseFontCSS = `html { font-size: ${sizingRatio}px }`
const webWidgetCSS = `${require('globalCSS')} ${webWidgetStyles}`

const baseWebWidgetStyle = {
  width: WIDGET_WIDTH + 20,
  maxHeight: 'calc(100vh - 10px)',
  height: MAX_WIDGET_HEIGHT,
  position: 'fixed',
  opacity: 0,
  border: 0
}

const mobileWebWidgetStyle = {
  width: '100%',
  height: '100%',
  position: 'fixed',
  opacity: 0,
  border: 0,
  top: 0
}

const fullscreenDesktopStyle = {
  height: '100%',
  maxHeight: 'none',
  width: '100%',
  maxWidth: '100%',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
}

// On mobile we don't want to transition the web widget's position
const mobileTransitionOverrides = {
  left: 0,
  bottom: null,
  right: null
}

const Embeds = () => {
  const translate = useTranslate()
  const dispatch = useDispatch()
  const visible = useSelector(state => getFrameVisible(state, 'webWidget'))
  const color = useSelector(state => getColor(state, 'webWidget'))
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
      {transitionStyles => (
        <BaseFrame
          title={translate('embeddable_framework.web_widget.frame.title') ?? ''}
          id="webWidget"
          visible={visible}
          style={{
            ...frameStyle,
            ...transitionStyles,
            ...(isMobileBrowser() ? mobileTransitionOverrides : {}),
            zIndex
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