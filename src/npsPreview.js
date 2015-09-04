import React            from 'react';
import { frameFactory } from 'embed/frameFactory';
import { Nps }          from 'component/Nps';

const npsCSS = require('embed/nps/nps.scss');

const renderNps = (locale, elem) => {
  const frameParams = {
    css: npsCSS,
    frameStyle: {
      position: 'static'
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
          updateFrameSize={params.updateFrameSize}
          npsSender={npsSender}
          ref='rootComponent' />
      );
    },
    frameParams
  ));

  const nps = React.render(<Embed />, elem);

  const setNpsState = (state) => {
    // Due to timing issues with when the iframe contents get written
    // getRootComponent could throw due to the child not existing yet
    if (nps.getRootComponent()) {
      nps.getRootComponent().setState(state);
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
      isMobile: isMobile
    });
  };

  return { setSurvey, setMobile };
};

window.zE = { renderNps };
