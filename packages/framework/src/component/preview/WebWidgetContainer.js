import React from 'react'
import PropTypes from 'prop-types'

import Frame from 'src/component/frame/Frame'
import { WebWidgetPreview } from './WebWidgetPreview'
import { webWidgetStyles } from 'embed/webWidget/webWidgetStyles'
import { generateUserWidgetCSS } from 'utility/color/styles'

const WebWidgetContainer = ({ store, frameStyle, containerStyle }) => {
  return (
    <Frame
      rawCSS={`
        ${require('globalCSS')} ${webWidgetStyles}
      `}
      generateUserCSS={generateUserWidgetCSS}
      customFrameStyle={frameStyle}
      name={'webWidget'}
      store={store}
      alwaysShow={true}
      disableOffsetHorizontal={true}
      preventClose={true}
      fullscreen={false}
      isMobile={false}
    >
      <WebWidgetPreview containerStyle={containerStyle} />
    </Frame>
  )
}

WebWidgetContainer.propTypes = {
  store: PropTypes.object.isRequired,
  frameStyle: PropTypes.shape({
    position: PropTypes.string,
    float: PropTypes.string,
    marginTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    marginRight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.string,
    height: PropTypes.string,
  }),
  containerStyle: PropTypes.shape({
    margin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.string,
  }),
}

export default WebWidgetContainer
