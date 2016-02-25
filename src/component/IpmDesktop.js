import React, { Component, PropTypes } from 'react';

import { Container } from 'component/Container';
import { Button } from 'component/Button';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { Icon } from 'component/Icon';

export class IpmDesktop extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    const { buttonUrl } = this.props.ipm.message;

    if (buttonUrl.trim().match(/^javascript:/)) {
      return;
    }

    const cleanUrl = buttonUrl.trim().match(/^https?/)
      ? buttonUrl
      : `//${buttonUrl}`;

    if (buttonUrl) {
      window.open(cleanUrl, '_blank');
    }

    this.props.closeFrame();
  }

  updateFrameSize() {
    if (this.props.updateFrameSize) {
      setTimeout(() => { this.props.updateFrameSize(); }, 0);
    }
  }

  getAvatarElement() {
    const props = {
      className: 'IpmDesktop-avatar u-posAbsolute u-paddingAN u-textCenter'
    };

    if (this.props.ipm.message.avatarUrl) {
      return (
        <img
          {...props}
          src={this.props.ipm.message.avatarUrl} />
      );
    } else {
      return (
        <Icon
          {...props}
          type='Icon--avatar' />
      );
    }
  }

  render() {
    this.updateFrameSize();

    return (
      <Container
        card={true}
        className='IpmDesktop u-paddingHXL u-marginHM u-marginBM'>
        <div className='Container-content u-paddingBM'>
          {this.getAvatarElement()}
          <p className='IpmDesktop-intro u-marginBS u-marginHN u-textCenter'>
            {this.props.ipm.message.secondaryText}
          </p>
          <p className='IpmDesktop-message u-paddingBL'>{this.props.ipm.message.body}</p>
          <div className='IpmDesktop-footer u-posRelative'>
            <ZendeskLogo
              className='IpmDesktop-footer--logo u-posStart--flush'
              utm='ipm' />
            <Button
              className='u-pullRight'
              onClick={this.handleOnClick}
              label={this.props.ipm.message.buttonText} />
          </div>
        </div>
      </Container>
    );
  }
}

IpmDesktop.propTypes = {
  ipm: PropTypes.object.isRequired,
  ipmSender: PropTypes.func.isRequired,
  updateFrameSize: PropTypes.func.isRequired,
  closeFrame: PropTypes.func.isRequired
};
