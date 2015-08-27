import React            from 'react';
import { frameFactory } from 'embed/frameFactory';
import { Nps }          from 'component/Nps';
import { i18n }         from 'service/i18n';

const npsCSS = require('embed/nps/nps.scss');

const renderNps = (locale = 'en-US', elem) => {
  i18n.setLocale(locale, true);

  const frameParams = {
    css: npsCSS,
    frameStyle: {
      position: 'static'
    }
  };

  const fakeSubmit = (params, done, fail) => {
    setTimeout(() => {
      done();
    }, 1500);
  };

  const Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <Nps
          npsSender={fakeSubmit}
          updateFrameSize={params.updateFrameSize}
          ref='rootComponent' />
      );
    },
    frameParams
  ));

  const setNpsState = (state) => {
    nps.getRootComponent().setState(state);
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

  const nps = React.render(<Embed />, elem);

  return { setSurvey, setMobile };
}

window.zE = { renderNps };
