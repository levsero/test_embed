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
      <Nps
        ref='rootComponent'
        updateFrameSize={params.updateFrameSize}
        style={{width: '375px', margin: '15px' }} />
    );
  },
  frameParams
));

const renderNPS = (locale = 'en-GB', id) => {
  i18n.setLocale(locale);
  return React.render(<Embed />, document.querySelector(`.npsPreview_${id}`));
}

window.zE = {
  renderNPS: renderNPS
};
