import React                 from 'react';
import _                     from 'lodash';

import { frameFactory }      from 'embed/frameFactory';
import { Nps }               from 'component/Nps';

const npsCSS = require('embed/nps/nps.scss');

const renderNps = (locale, elem) => {
  let nps;

  const frameStyle = {
    bottom: '0',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
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
    // Due to timing issues with when the iframe contents get written
    // getRootComponent could throw due to the child not existing yet
    if (nps.getRootComponent()) {
      nps.getRootComponent().setState(state);
      if (state.survey && state.survey.highlightColor) {
        nps.setHighlightColor(state.survey.highlightColor);
      }
    } else {
      setTimeout(() => {
        setNpsState(state);
      }, 0);
    }
  };

  const setSurvey = (survey) => {
    setNpsState({
      survey: survey
    });
  };

  const setMobile = (isMobile) => {
    setNpsState({
      isMobile
    });
    nps.getChild().setState({ isMobile });
    /* jshint laxbreak: true */
    nps.setState({
      frameStyle: isMobile
                  ? _.extend({}, frameStyle, { position: 'absolute' })
                  : frameStyle
    });
  };

  return { setSurvey, setMobile };
};

window.zE = { renderNps };
