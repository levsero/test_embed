import React from 'react/addons';

import { Nps } from 'component/Nps';

export const NpsPreview = React.createClass({
  getInitialState() {
    return {
      isMobile: false,
      survey: {}
    };
  },

  componentDidUpdate() {
    this.refs.nps.setState(this.state);
  },

  render() {
    /* jshint laxbreak: true */
    return (this.state.isMobile)
      ? <div
          {...this.props}
          ref='nps'
          style={{background: 'red', height: 100, width: 100}} />
      : <Nps
          {...this.props}
          ref='nps'
          style={{width: '375px', margin: '15px' }} />;
  }
});

