import React from 'react/addons';

import { Container } from 'component/Container';
//import { Icon } from 'component/Icon';
//import { ZendeskLogo } from 'component/ZendeskLogo';

export const IpmDesktop = React.createClass({
  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  render() {
    if (this.props.updateFrameSize) {
      setTimeout(() => { this.props.updateFrameSize(); }, 0);
    }

    const imgStyles = {
      position: 'absolute',
      borderRadius: '50%',
      top: '-30px',
      left: '50%',
      marginLeft: '-30px'
    };

    return (
      <Container
        card={true}
        style={{margin: '60px 15px 15px'}}>
        <div className='Container-content u-paddingBL'>
          <img
            style={imgStyles}
            src='https://avatars3.githubusercontent.com/u/143402?v=3&s=96'
            width='60'
            height='60' />
          <p>{this.props.ipm.message}</p>
          <p>{this.props.ipm.signOff}</p>
        </div>
      </Container>
    );
  }
});
