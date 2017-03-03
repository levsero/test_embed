import React, { Component, PropTypes } from 'react';

import { IpmDesktop } from 'component/ipm/IpmDesktop';
import { i18n } from 'service/i18n';
import { identity } from 'service/identity';
import { logging } from 'service/logging';
import { getPageTitle } from 'utility/utils';

export class Ipm extends Component {
  static propTypes = {
    closeFrame: PropTypes.func.isRequired,
    ipmSender: PropTypes.func.isRequired,
    mobile: PropTypes.bool.isRequired,
    setFrameSize: PropTypes.func,
    updateFrameSize: PropTypes.func
  };

  static defaultProps = {
    setFrameSize: () => {},
    updateFrameSize: () => {}
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      ipm: {
        id: null,
        message: {},
        name: '',
        recipientEmail: '',
        type: ''
      },
      ipmAvailable: null,
      isMobile: props.mobile,
      url: ''
    };
  }

  ipmSender = (name) => {
    if (!this.state.ipm.id) {
      logging.error({
        error: new Error('Cannot send an IPM event without a campaign'),
        context: this.state
      });

      return;
    }

    const recipientEmail = this.state.ipm.recipientEmail;
    const params = {
      campaignId: this.state.ipm.id,
      recipientEmail,
      anonymousSuid: recipientEmail ? undefined : identity.getSuid().id,
      event: {
        anonymousId: identity.getBuid(),
        locale: i18n.getLocale(),
        title: getPageTitle(),
        type: name,
        url: this.state.url
      }
    };

    this.props.ipmSender(params);
  }

  render = () => {
    return (
      <IpmDesktop
        {...this.state}
        updateFrameSize={this.props.updateFrameSize}
        closeFrame={this.props.closeFrame} />
    );
  }
}
