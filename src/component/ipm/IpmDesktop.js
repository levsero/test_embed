import React, { Component, PropTypes } from 'react';
import classNames from 'classNames';

import { Container } from 'component/Container';
import { Button } from 'component/button/Button';
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
      const ipmWindow = window.open(cleanUrl, '_blank');

      // Fixes security issue with new windows changing opener url
      ipmWindow.opener = null;
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
    const logoClasses = classNames({
      'IpmDesktop-footer--logo u-posStart--flush': true,
      'IpmDesktop-footer--logo--golion': this.props.golionLogo
    });

    this.updateFrameSize();

    return (
      <Container
        card={true}
        className='IpmDesktop u-paddingHXL u-marginBM'>
        <div className='Container-content u-paddingBM'>
          {this.getAvatarElement()}
          <p className='IpmDesktop-intro u-marginBS u-marginHN u-textCenter'>
            {this.props.ipm.message.secondaryText}
          </p>
          <p className='IpmDesktop-message u-paddingBL'>{this.props.ipm.message.body}</p>
          <div className='IpmDesktop-footer u-posRelative'>
            <ZendeskLogo
              className={logoClasses}
              golionLogo={this.props.golionLogo}
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
  updateFrameSize: PropTypes.func.isRequired,
  closeFrame: PropTypes.func.isRequired,
  golionLogo: PropTypes.bool
};

IpmDesktop.defaultProps = {
  golionLogo: false
};
