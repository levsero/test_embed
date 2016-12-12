import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { SubmitTicket } from 'component/submitTicket/submitTicket';

export class WebWidget extends Component {
  render() {
    const { submitTicketConfig } = this.props;

    return (
      <SubmitTicket
        ref='rootComponent'
        customFields={submitTicketConfig.customFields}
        hideZendeskLogo={submitTicketConfig.hideZendeskLogo}
        onCancel={this.props.onCancel}
        submitTicketSender={this.props.submitTicketSender}
        attachmentSender={this.props.attachmentSender}
        onSubmitted={this.props.onSubmitted}
        position={submitTicketConfig.position}
        formTitleKey={submitTicketConfig.formTitleKey}
        style={this.props.style}
        showBackButton={this.props.showBackButton}
        attachmentsEnabled={submitTicketConfig.attachmentsEnabled}
        subjectEnabled={this.props.subjectEnabled}
        maxFileCount={submitTicketConfig.maxFileCount}
        maxFileSize={submitTicketConfig.maxFileSize}
        updateFrameSize={this.props.updateFrameSize} />
    );
  }
}

WebWidget.propTypes = {
  submitTicketConfig: PropTypes.object,
  submitTicketSender: PropTypes.func.isRequired,
  attachmentSender: PropTypes.func.isRequired,
  updateFrameSize: PropTypes.func,
  style: PropTypes.object,
  position: PropTypes.string,
  onSubmitted: PropTypes.func,
  onCancel: PropTypes.func,
  subjectEnabled: PropTypes.bool,
  showBackButton: PropTypes.func
};

WebWidget.defaultProps = {
  submitTicketConfig: {},
  updateFrameSize: () => {},
  style: null,
  position: 'right',
  onSubmitted: () => {},
  onCancel: () => {},
  showBackButton: () => {}
};
