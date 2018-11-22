import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ChatBadge  from 'src/component/launcher/ChatBadge';
import WidgetLauncher from 'src/component/launcher/WidgetLauncher';
import { getShowChatBadgeLauncher } from 'src/redux/modules/selectors';

import { launcherClicked } from 'src/redux/modules/base';

const mapStateToProps = (state) => {
  return {
    showChatBadgeLauncher: getShowChatBadgeLauncher(state)
  };
};

class Launcher extends Component {
  static propTypes = {
    showChatBadgeLauncher: PropTypes.bool,
    onClickHandler: PropTypes.func,
    updateFrameTitle: PropTypes.func,
    labelKey: PropTypes.string,
    launcherClicked: PropTypes.func,
    forceUpdateWorld: PropTypes.func,
    hideBranding: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
  }

  handleBadgeClick = (e) => {
    this.props.onClickHandler(e);
    this.props.launcherClicked(e);
  }

  render = () => {
    return (this.props.showChatBadgeLauncher)
      ? (
        <ChatBadge onSend={this.handleBadgeClick} hideBranding={this.props.hideBranding} />
      ) : (
        <WidgetLauncher
          onClick={this.props.onClickHandler}
          updateFrameTitle={this.props.updateFrameTitle}
          label={this.props.labelKey}
          forceUpdateWorld={this.props.forceUpdateWorld} />
      );
  }
}

const actionCreators = {
  launcherClicked
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Launcher);
