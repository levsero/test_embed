import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { getZoomSizingRatio, isMobileBrowser } from 'utility/devices'
import WidgetLauncher from 'component/launcher/Launcher'
import { useDispatch, useSelector } from 'react-redux'
import { getColor, getFrameVisible, getHideZendeskLogo } from 'src/redux/modules/selectors'
import { generateUserLauncherCSS } from 'utility/color/styles'
import { FONT_SIZE } from 'constants/shared'
import BaseFrame from 'embeds/webWidget/components/BaseFrame'
import { getStylingZIndex } from 'src/redux/modules/settings/settings-selectors'
import FrameTransition from 'embeds/webWidget/components/BaseFrame/FrameTransition'
import { renewToken } from 'src/redux/modules/base'
import useTranslate from 'src/hooks/useTranslate'
import { launcherStyles } from './styles'

const sizingRatio = FONT_SIZE * getZoomSizingRatio()
const launcherCSS = `${require('globalCSS')} ${launcherStyles}`
const baseFontCSS = `html { font-size: ${sizingRatio}px }`

const baseLauncherStyle = {
  width: 240,
  height: 50,
  padding: 0,
  marginLeft: 20,
  marginRight: 20,
  marginTop: 10,
  marginBottom: 10,
  position: 'fixed',
  bottom: 30,
  overflow: 'visible',
  opacity: 0,
  border: 0,
}

const getMobileStyles = () => ({
  height: `${50 * getZoomSizingRatio()}px`,
  bottom: 0,
  marginTop: Math.round(parseInt(baseLauncherStyle.marginTop, 10) * getZoomSizingRatio()),
  marginBottom: Math.round(parseInt(baseLauncherStyle.marginBottom, 10) * getZoomSizingRatio()),
  marginLeft: Math.round(parseInt(baseLauncherStyle.marginLeft, 10) * getZoomSizingRatio()),
  marginRight: Math.round(parseInt(baseLauncherStyle.marginRight, 10) * getZoomSizingRatio()),
})

const Launcher = ({ labelKey }) => {
  const translate = useTranslate()
  const [title, setTitle] = useState(translate('embeddable_framework.launcher.frame.title') ?? '')
  const launcherContainer = useRef()
  const dispatch = useDispatch()
  const color = useSelector((state) => getColor(state, 'launcher'))
  const visible = useSelector((state) => getFrameVisible(state, 'launcher'))
  const hideZendeskLogo = useSelector(getHideZendeskLogo)
  const zIndex = useSelector(getStylingZIndex)

  const frameStyle = { ...baseLauncherStyle, zIndex: zIndex - 1 }
  if (isMobileBrowser()) {
    Object.assign(frameStyle, getMobileStyles())
  }

  return (
    <FrameTransition visible={visible}>
      {(transitionStyles) => (
        <BaseFrame
          title={title}
          id="launcher"
          visible={visible}
          style={{ ...frameStyle, ...transitionStyles }}
          color={color}
          tabIndex={visible ? '0' : '-1'}
        >
          <style dangerouslySetInnerHTML={{ __html: launcherCSS }} />
          <style dangerouslySetInnerHTML={{ __html: generateUserLauncherCSS(color) }} />
          <style dangerouslySetInnerHTML={{ __html: baseFontCSS }} />

          <div ref={launcherContainer} style={{ float: 'right' }}>
            <WidgetLauncher
              onClickHandler={(e) => {
                e.preventDefault()

                dispatch(renewToken())
              }}
              updateFrameTitle={setTitle}
              hideBranding={hideZendeskLogo}
              fullscreen={false}
              isMobile={isMobileBrowser()}
              labelKey={labelKey}
            />
          </div>
        </BaseFrame>
      )}
    </FrameTransition>
  )
}

Launcher.propTypes = {
  labelKey: PropTypes.string,
}

export default Launcher
