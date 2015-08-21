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

let isMobileBrowser = false;

const Embed = React.createClass(frameFactory(
  (params) => {
    return (
      (isMobileBrowser)
        ? <div
            ref='rootComponent'
            updateFrameSize={params.updateFrameSize}
            style={{background: "red", height: 100, width: 100}} />
        : <Nps
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
  renderNPS: renderNPS,
  isMobileBrowser: isMobileBrowser
};
