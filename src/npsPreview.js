import React            from 'react';
import { frameFactory } from 'embed/frameFactory';
import { Nps }          from 'component/Nps';
import { i18n }         from 'service/i18n';

const npsCSS = require('embed/nps/nps.scss');

const frameParams = {
  css: npsCSS,
  frameStyle: {
    position: 'static'
  }
};

const Embed = React.createClass(frameFactory(
  (params) => {
    return (
      <ParentNps
        style={{width: '375px', margin: '15px' }}
        updateFrameSize={params.updateFrameSize}
        ref='rootComponent' />
    );
  },
  frameParams
));

const ParentNps = React.createClass({
  getInitialState() {
    return {
      isMobile: false,
      survey: {}
    }
  },
  componentDidUpdate(props, state) {
    this.refs.nps.setState(this.state);
  },
  render() {
    if (this.props.updateFrameSize) {
      setTimeout(() => this.props.updateFrameSize(), 0);
    }

    return (this.state.isMobile)
        ? <div ref='nps' style={{background: "red", height: 100, width: 100}} />
        : <Nps ref='nps' style={this.props.style} />
  }
});

const renderNPS = (locale = 'en-GB', id) => {
  i18n.setLocale(locale);
  return React.render(<Embed />, document.querySelector(`.npsPreview_${id}`));
}

window.zE = {
  renderNPS: renderNPS
};
