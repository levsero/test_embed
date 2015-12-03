import React from 'react/addons';

import { Container } from 'component/Container';
import { Button } from 'component/Button';
import { ZendeskLogo } from 'component/ZendeskLogo';

export const IpmDesktop = React.createClass({
  handleOnClick() {
    if (this.props.ipm.buttonLink) {
      window.open(this.props.ipm.buttonLink, '_blank');
    }
  },

  updateFrameSize() {
    if (this.props.updateFrameSize) {
      setTimeout(() => { this.props.updateFrameSize(); }, 0);
    }
  },

  render() {
    this.updateFrameSize();

    return (
      <Container
        card
        className='IpmDesktop u-paddingHXL u-marginHM u-marginBM'>
        <div className='Container-content u-paddingBM'>
          <img
            className='IpmDesktop-avatar u-posAbsolute'
            src={this.props.ipm.avatarUrl} />
          <p className='IpmDesktop-intro u-marginBS u-marginHN u-textCenter'>
            {this.props.ipm.sender}
          </p>
          <p className='IpmDesktop-message u-paddingBL'>{this.props.ipm.message}</p>
          <div className='IpmDesktop-footer u-posRelative'>
            <ZendeskLogo
              className='IpmDesktop-footer--logo u-posStart--flush'
              utm='ipm' />
            <Button
              className='u-pullRight'
              onClick={this.handleOnClick}
              label={this.props.ipm.buttonText} />
          </div>
        </div>
      </Container>
    );
  }
});
