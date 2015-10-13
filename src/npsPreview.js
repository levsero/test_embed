import React                 from 'react';
import _                     from 'lodash';

import { frameFactory }      from 'embed/frameFactory';
import { Nps }               from 'component/Nps';

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
    display: 'block'
  };

  const frameParams = {
    css: npsCSS,
    frameStyle,
    fullscreenable: true,
    isMobile: false,
    onClose() {
      const npsComponent = nps.getRootComponent();
      const newState = npsComponent.getInitialState();

      newState.survey = _.extend(npsComponent.getInitialState().survey, npsComponent.state.survey);
      newState.isMobile = npsComponent.state.isMobile;

      npsComponent.setState(newState);

      setTimeout(() => {
        if (npsComponent.refs.mobile) {
          npsComponent.refs.mobile.setState(npsComponent.refs.mobile.getInitialState());
        }

        if (npsComponent.refs.desktop) {
          npsComponent.refs.desktop.setState(npsComponent.refs.desktop.getInitialState());
        }

        nps.show();
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
          npsSender={npsSender}
          mobile={false}
          ref='rootComponent' />
      );
    },
    frameParams
  ));

  nps = React.render(<Embed />, elem);

  const setNpsState = (state) => {
    setTimeoutLoop(nps.getRootComponent, () => {
      nps.getRootComponent().setState(state);
      if (state.survey && state.survey.highlightColor) {
        nps.setHighlightColor(state.survey.highlightColor);
      }
    });
  };

  const setSurvey = (survey) => {
    setNpsState({
      survey: survey
    });
  };

  const setMobile = (isMobile) => {
    setTimeoutLoop(() => nps && nps.getChild(), () => {
      setNpsState({
        isMobile
      });
      nps.getChild().setState({ isMobile });
      nps.setState({
        frameStyle: isMobile ? _.extend({}, frameStyle, { position: 'absolute' }) : frameStyle
      });
    });
  };

  return { setSurvey, setMobile };
};

window.zE = { renderNps };
