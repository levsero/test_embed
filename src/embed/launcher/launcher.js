import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { Provider } from 'react-redux'

import { launcherStyles } from './launcherStyles'
import { document, getDocumentHost } from 'utility/globals'
import Frame from 'component/frame/Frame'
import Launcher from 'component/launcher/Launcher'
import { generateUserLauncherCSS } from 'utility/color/styles'
import { isMobileBrowser, getZoomSizingRatio } from 'utility/devices'
import { renewToken } from 'src/redux/modules/base'
import { FRAME_OFFSET_WIDTH, FRAME_OFFSET_HEIGHT } from 'constants/launcher'

const launcherCSS = `${require('globalCSS')} ${launcherStyles}`

let embed

const adjustWidth = (frameStyle, el) => {
  const width = Math.max(el.clientWidth, el.offsetWidth)

  return {
    ...frameStyle,
    width: (_.isFinite(width) ? width : 0) + FRAME_OFFSET_WIDTH
  }
}

const adjustStylesForZoom = (frameStyle, el) => {
  const zoomRatio = getZoomSizingRatio()
  const adjustMargin = margin => {
    const adjustedMargin = Math.round(parseInt(margin, 10) * zoomRatio)

    return `${adjustedMargin}px`
  }
  const margins = _.pick(frameStyle, ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'])
  const result = _.mapValues(margins, adjustMargin)
  const height = {
    height: `${50 * zoomRatio}px`
  }

  return _.extend({}, frameStyle, adjustWidth(frameStyle, el), result, height)
}

function create(name, config = { props: {} }, reduxStore) {
  const embedConfig = config
  const { visible } = embedConfig
  const isMobile = isMobileBrowser()
  const params = {
    ref: el => {
      embed.instance = el
    },
    css: launcherCSS,
    generateUserCSS: generateUserLauncherCSS,
    frameStyleModifier: isMobile ? adjustStylesForZoom : adjustWidth,
    frameOffsetWidth: FRAME_OFFSET_WIDTH,
    frameOffsetHeight: FRAME_OFFSET_HEIGHT,
    fullscreenable: false,
    hideNavigationButtons: true,
    name: name,
    visible: visible,
    isMobile: isMobile,
    fullscreen: false
  }

  const onClickHandler = e => {
    e.preventDefault()

    // Re-authenticate user if their oauth token is within 20 minutes of expiring
    reduxStore.dispatch(renewToken())
  }

  const updateFrameTitle = title => {
    if (get(name).instance) {
      get(name).instance.updateFrameTitle(title)
    }
  }

  const component = (
    <Provider store={reduxStore}>
      <Frame {...params} store={reduxStore}>
        <Launcher
          onClickHandler={onClickHandler}
          updateFrameTitle={updateFrameTitle}
          hideBranding={config.props.hideZendeskLogo}
          labelKey={config.props.labelKey}
          fullscreen={false}
          isMobile={isMobile}
        />
      </Frame>
    </Provider>
  )

  embed = {
    component: component,
    config: embedConfig
  }
}

function get() {
  return embed
}

function render() {
  if (embed && embed.instance) {
    throw new Error('Launcher has already been rendered.')
  }

  const element = getDocumentHost().appendChild(document.createElement('div'))

  ReactDOM.render(embed.component, element)
}

export const launcher = {
  create: create,
  get: get,
  render: render
}
