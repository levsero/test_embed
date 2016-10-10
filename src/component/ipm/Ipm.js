import React, { Component, PropTypes } from 'react';

import { IpmDesktop } from 'component/ipm/IpmDesktop';
import { i18n } from 'service/i18n';
import { identity } from 'service/identity';
import { logging } from 'service/logging';
import { getPageTitle } from 'utility/utils';

export class Ipm extends Component {
  constructor(props, context) {
    super(props, context);
    this.ipmSender = this.ipmSender.bind(this);

    this.state = {
      ipm: {
        id: null,
        name: '',
        type: '',
        recipientEmail: '',
        message: {}
      },
      url: '',
      ipmAvailable: null,
      isMobile: props.mobile
    };
  }

  ipmSender(name) {
    if (!this.state.ipm.id) {
      logging.error({
        error: new Error('Cannot send an IPM event without a campaign'),
        context: this.state
      });

      return;
    }

    const params = {
      event: {
        campaignId: this.state.ipm.id,
        email: this.state.ipm.recipientEmail,
        type: name,
        url: this.state.url,
        title: getPageTitle(),
        locale: i18n.getLocale(),
        'anonymous_id': identity.getBuid()
      }
    };

    this.props.ipmSender(params);
  }

  render() {
    return (
      <IpmDesktop
        {...this.state}
        updateFrameSize={this.props.updateFrameSize}
        golionLogo={this.props.golionLogo}
        closeFrame={this.props.closeFrame} />
    );
  }
}

Ipm.propTypes = {
  ipmSender: PropTypes.func.isRequired,
  mobile: PropTypes.bool.isRequired,
  closeFrame: PropTypes.func.isRequired,
  setFrameSize: PropTypes.func,
  updateFrameSize: PropTypes.func,
  golionLogo: PropTypes.bool
};

Ipm.defaultProps = {
  setFrameSize: () => {},
  updateFrameSize: () => {},
  golionLogo: false
};
