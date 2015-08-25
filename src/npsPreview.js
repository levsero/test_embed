import React            from 'react';
import { frameFactory } from 'embed/frameFactory';
import { Nps }          from 'component/Nps';
import { i18n }         from 'service/i18n';

const npsCSS = require('embed/nps/nps.scss');

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

  fakeSubmit(params, done, fail) {
    setTimeout(() => {
      done();
    }, 1500)
  },

  render() {
    return (this.state.isMobile)
      ? <div
          ref='nps'
          npsSender={this.fakeSubmit}
          updateFrameSize={this.props.updateFrameSize}
          style={{background: "red", height: 100, width: 100}} />
      : <Nps
          ref='nps'
          npsSender={this.fakeSubmit}
          updateFrameSize={this.props.updateFrameSize}
          style={{width: '375px', margin: '15px' }} />
  }
});

const renderNPS = (locale = 'en-US', id) => {
  i18n.setLocale(locale, true);

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
          updateFrameSize={params.updateFrameSize}
          ref='rootComponent' />
      );
    },
    frameParams
  ));

  return React.render(<Embed />, document.querySelector(`.npsPreview_${id}`));
}

window.zE = {
  renderNPS: renderNPS
};
