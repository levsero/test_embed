import Frame from 'classicSrc/component/frame/Frame'
import { webWidgetStyles } from 'classicSrc/embed/webWidget/webWidgetStyles'
import { generateUserWidgetCSS } from 'classicSrc/util/color/styles'
import PropTypes from 'prop-types'
import { WebWidgetPreview } from './WebWidgetPreview'

const WebWidgetContainer = ({ store, frameStyle, containerStyle }) => {
  return (
    <Frame
      rawCSS={`
        ${require('classicSrc/styles/globals.scss')} ${webWidgetStyles}
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
