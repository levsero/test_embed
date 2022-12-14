import Frame from 'classicSrc/component/frame/Frame'
import { FRAME_OFFSET_WIDTH, FRAME_OFFSET_HEIGHT } from 'classicSrc/constants/launcher'
import { launcherStyles } from 'classicSrc/embeds/webWidget/components/Launcher/styles'
import { generateUserLauncherCSS } from 'classicSrc/util/color/styles'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { LauncherPreview } from './LauncherPreview'

export class LauncherContainer extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    webWidgetVisible: PropTypes.bool,
    frameStyle: PropTypes.shape({
      position: PropTypes.string,
      float: PropTypes.string,
      marginTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      marginRight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      width: PropTypes.string,
      height: PropTypes.string,
    }),
  }

  static defaultProps = {
    webWidgetVisible: false,
  }

  constructor(props) {
    super(props)

    this.frame = null
  }

  render() {
    const { store, webWidgetVisible, frameStyle } = this.props

    if (webWidgetVisible) return null

    return (
      <Frame
        ref={(el) => {
          if (el) this.frame = el
        }}
        rawCSS={`
          ${require('classicSrc/styles/globals.scss')} ${launcherStyles}
        `}
        generateUserCSS={generateUserLauncherCSS}
        name={'launcher'}
        customFrameStyle={frameStyle}
        frameOffsetWidth={FRAME_OFFSET_WIDTH}
        frameOffsetHeight={FRAME_OFFSET_HEIGHT}
        hideNavigationButtons={true}
        store={store}
        alwaysShow={true}
        disableOffsetHorizontal={true}
        preventClose={true}
        fullscreen={false}
        isMobile={false}
      >
        <LauncherPreview />
      </Frame>
    )
  }
}
