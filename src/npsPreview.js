import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { frameFactory } from 'embed/frameFactory';
import { Nps } from 'component/nps/Nps';

// unregister lodash from window._
if (!__DEV__) {
  _.noConflict();
}

const npsCSS = require('embed/nps/nps.scss');

const renderNps = (locale, elem) => {
  let nps;

  const setTimeoutLoop = (condition, func) => {
    // Due to timing issues with when the iframe contents get written
    // getRootComponent or nps.getChild() could throw due to the child not existing yet
    if (condition()) {
      func();
    } else {
      setTimeout(() => setTimeoutLoop(condition, func), 0);
    }
  };

  const frameStyle = {
    bottom: '0',
    margin: '0',
    display: 'inline-block'
  };

  const frameParams = {
    css: npsCSS,
    name: 'npsPreview',
    frameStyle,
    fullscreenable: true,
    isMobile: false,
    disableSetOffsetHorizontal: true,
    onClose(frame) {
      const npsComponent = nps.getRootComponent();

      npsComponent.resetState({survey: npsComponent.state.survey});

      setTimeout(() => {
        if (npsComponent.refs.mobile) {
          npsComponent.refs.mobile.resetState();
        }

        if (npsComponent.refs.desktop) {
          npsComponent.refs.desktop.resetState();
        }

        nps.show();
        frame.setOffsetHorizontal(0);
      }, 0);
    }
  };

  const npsSender = (params, done) => {
    setTimeout(() => {
      done();
    }, 1500);
  };

  const Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <Nps
          setFrameSize={params.setFrameSize}
          updateFrameSize={params.updateFrameSize}
          setOffsetHorizontal={params.setOffsetHorizontal}
          npsSender={npsSender}
          mobile={false}
          ref='rootComponent' />
      );
    },
    frameParams
  ));

  nps = ReactDOM.render(<Embed />, elem);

  const setNpsState = (state) => {
    setTimeoutLoop(nps.getRootComponent, () => {
      nps.getRootComponent().setState(state);
      if (state.survey && state.survey.highlightColor) {
        nps.setHighlightColor(state.survey.highlightColor);
      }
    });
  };

  const setSurvey = (survey) => {
    setNpsState({ survey: survey });
  };

  const setMobile = (isMobile) => {
    setTimeoutLoop(() => nps && nps.getChild(), () => {
      setNpsState({ isMobile });
      nps.getChild().setState({ isMobile });
      nps.setState({
        frameStyle: isMobile
                  ? _.extend({}, frameStyle, { position: 'absolute', display: 'block' })
                  : frameStyle
      });
    });
  };

  return { setSurvey, setMobile };
};

window.zE = { renderNps };
