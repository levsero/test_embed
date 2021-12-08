import ChatBadge from 'classicSrc/component/launcher/ChatBadge'
import WidgetLauncher from 'classicSrc/component/launcher/WidgetLauncher'
import { launcherClicked } from 'classicSrc/redux/modules/base'
import { getShowChatBadgeLauncher, getHideZendeskLogo } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    showChatBadgeLauncher: getShowChatBadgeLauncher(state),
    hideBranding: getHideZendeskLogo(state),
  }
}

class Launcher extends Component {
  static propTypes = {
    showChatBadgeLauncher: PropTypes.bool,
    onClickHandler: PropTypes.func,
    updateFrameTitle: PropTypes.func,
    labelKey: PropTypes.string,
    launcherClicked: PropTypes.func,
    hideBranding: PropTypes.bool,
    isMobile: PropTypes.bool,
  }

  static defaultProps = {
    labelKey: 'help',
  }

  constructor(props, context) {
    super(props, context)

    this.launcher = null
    this.chatBadge = null
  }

  handleBadgeClick = (e) => {
    this.props.onClickHandler(e)
    this.props.launcherClicked(e)
  }

  getActiveComponent = () => {
    return this
  }

  forceUpdate() {
    if (this.launcher) this.launcher.forceUpdate()
    if (this.chatBadge) this.chatBadge.forceUpdate()
  }

  render = () => {
    return this.props.showChatBadgeLauncher ? (
      <ChatBadge
        ref={(el) => (this.chatBadge = el)}
        onSend={this.handleBadgeClick}
        hideBranding={this.props.hideBranding}
      />
    ) : (
      <WidgetLauncher
        ref={(el) => (this.launcher = el)}
        onClick={this.props.onClickHandler}
        updateFrameTitle={this.props.updateFrameTitle}
        label={`embeddable_framework.launcher.label.${this.props.labelKey}`}
        isMobile={this.props.isMobile}
      />
    )
  }
}

const actionCreators = {
  launcherClicked,
}

export default connect(mapStateToProps, actionCreators, null, { forwardRef: true })(Launcher)
