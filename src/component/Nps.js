import React from 'react/addons';

import { NpsDesktop } from 'component/NpsDesktop';

export const Nps = React.createClass({
  getInitialState() {
    return {
      isMobile: false,
      survey: {}
    };
  },

  componentDidUpdate(props, state) {
    this.refs.nps.setState(this.state);
  },

  render() {
    return (this.state.isMobile)
      ? <div
          {...this.props}
          ref='nps'
          style={{background: "red", height: 100, width: 100}} />
      : <NpsDesktop
          {...this.props}
          ref='nps'
          style={{width: '375px', margin: '15px' }} />
  }
});

