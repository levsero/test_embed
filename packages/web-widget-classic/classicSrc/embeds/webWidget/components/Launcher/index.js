import WidgetLauncher from 'classicSrc/component/launcher/Launcher'
import { FONT_SIZE } from 'classicSrc/constants/shared'
import BaseFrame from 'classicSrc/embeds/webWidget/components/BaseFrame'
import FrameTransition from 'classicSrc/embeds/webWidget/components/BaseFrame/FrameTransition'
import useTranslate from 'classicSrc/hooks/useTranslate'
import { renewToken } from 'classicSrc/redux/modules/base'
import { getColor, getFrameVisible, getHideZendeskLogo } from 'classicSrc/redux/modules/selectors'
import { getStylingZIndex } from 'classicSrc/redux/modules/settings/settings-selectors'
import { generateUserLauncherCSS } from 'classicSrc/util/color/styles'
import PropTypes from 'prop-types'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isMobileBrowser, getZoomSizingRatio } from '@zendesk/widget-shared-services'
import { launcherStyles } from './styles'

const sizingRatio = FONT_SIZE * getZoomSizingRatio()
const launcherCSS = `${require('classicSrc/styles/globals.scss')} ${launcherStyles}`
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
