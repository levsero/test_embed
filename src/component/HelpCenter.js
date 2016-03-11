import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import { Container } from 'component/Container';
import { HelpCenterDesktop } from 'component/HelpCenterDesktop';
import { HelpCenterMobile } from 'component/HelpCenterMobile';
import { isMobileBrowser } from 'utility/devices';
import { bindMethods } from 'utility/utils';

export class HelpCenter extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, HelpCenter.prototype);
  }

  render() {
    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(), 0);
    }

    const helpCenter = (!isMobileBrowser())
                     ? <HelpCenterDesktop
                          ref='rootComponent'
                          hideZendeskLogo={this.props.hideZendeskLogo}
                          onNextClick={this.props.onNextClick}
                          onSearch={this.props.onSearch}
                          position={this.props.position}
                          buttonLabelKey={this.props.buttonLabelKey}
                          formTitleKey={this.props.formTitleKey}
                          showBackButton={this.props.showBackButton}
                          searchSender={this.props.searchSender}
                          contextualSearchSender={this.props.contextualSearchSender}
                          style={this.props.containerStyle}
                          updateFrameSize={this.props.updateFrameSize}
                          zendeskHost={this.props.zendeskHost} />
                     : <HelpCenterMobile
                          ref='rootComponent'
                          hideZendeskLogo={this.props.hideZendeskLogo}
                          onNextClick={this.props.onNextClick}
                          onSearch={this.props.onSearch}
                          position={this.props.position}
                          buttonLabelKey={this.props.buttonLabelKey}
                          formTitleKey={this.props.formTitleKey}
                          showBackButton={this.props.showBackButton}
                          searchSender={this.props.searchSender}
                          contextualSearchSender={this.props.contextualSearchSender}
                          style={this.props.containerStyle}
                          updateFrameSize={this.props.updateFrameSize}
                          zendeskHost={this.props.zendeskHost} />

    return (
      <Container
        style={this.props.style}
        fullscreen={isMobileBrowser()}>
        {helpCenter}
      </Container>
    );
  }
}

HelpCenter.propTypes = {
  searchSender: PropTypes.func.isRequired,
  contextualSearchSender: PropTypes.func.isRequired,
  buttonLabelKey: PropTypes.string,
  onSearch: PropTypes.func,
  showBackButton: PropTypes.func,
  onNextClick: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  updateFrameSize: PropTypes.any,
  style: PropTypes.object,
  formTitleKey: PropTypes.string
};

HelpCenter.defaultProps = {
  buttonLabelKey: 'message',
  onSearch: () => {},
  showBackButton: () => {},
  onNextClick: () => {},
  hideZendeskLogo: false,
  updateFrameSize: false,
  style: null,
  formTitleKey: 'help'
};
