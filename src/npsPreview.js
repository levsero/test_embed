import React            from 'react';
import { frameFactory } from 'embed/frameFactory';
import { NpsPreview }   from 'component/NpsPreview';
import { i18n }         from 'service/i18n';

const npsCSS = require('embed/nps/nps.scss');

const renderNps = (locale, elem) => {
  i18n.setLocale(locale, true);

  const frameParams = {
    css: npsCSS,
    frameStyle: {
      position: 'static'
    }
  };

  const fakeSubmit = (params, done) => {
    setTimeout(() => {
      done();
    }, 1500);
  };

  const Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <NpsPreview
          npsSender={fakeSubmit}
          updateFrameSize={params.updateFrameSize}
          ref='rootComponent' />
      );
    },
    frameParams
  ));

  const nps = React.render(<Embed />, elem);

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

  return { setSurvey, setMobile };
};

window.zE = { renderNps };
