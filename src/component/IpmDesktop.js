import React from 'react/addons';

import { Container } from 'component/Container';
import { Button } from 'component/Button';
import { ZendeskLogo } from 'component/ZendeskLogo';

export const IpmDesktop = React.createClass({
  render() {
    if (this.props.updateFrameSize) {
      setTimeout(() => { this.props.updateFrameSize(); }, 0);
    }

    return (
      <Container
        card={true}
        className='IpmDesktop u-paddingHXL'>
        <div className='Container-content u-paddingBM'>
          <img
            className='IpmDesktop-avatar u-posAbsolute'
            src='https://avatars3.githubusercontent.com/u/143402?v=3&s=96'
            width='60'
            height='60' />
          <p className='IpmDesktop-intro'>{this.props.ipm.signOff}</p>
          <p className='IpmDesktop-message u-paddingBL'>{this.props.ipm.message}</p>
          <div style={{height: '36px'}}>
            <ZendeskLogo
              className='u-posStatic' />
            <Button
              className='u-pullRight'
              label='Take a look!' />
          </div>
        </div>
      </Container>
    );
  }
});
