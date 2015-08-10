import React from 'react/addons';
import _     from 'lodash';

import { frameFactory } from 'embed/frameFactory';
import { Nps } from 'component/Nps';
import { mediator } from 'service/mediator';
import { document,
         getDocumentHost } from 'utility/globals';

const npsCSS = require('./nps.scss');

let npses = {};

function create(name, config) {
  const frameStyle = {
    position: 'fixed',
    right: '0px',
    top: '0px'
  };

  const frameParams = {
    frameStyle: frameStyle,
    css: npsCSS,
    hideCloseButton: false,
    fullscreenable: false,
    name: name
  };

  let Embed = React.createClass(frameFactory(
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

  npses[name] = {
    component: <Embed visible={false} />,
    config: config
  };
}

function get(name) {
  return npses[name];
}

function render(name) {
  const element = getDocumentHost().appendChild(document.createElement('div'));

  npses[name].instance = React.render(npses[name].component, element);

  mediator.channel.subscribe('nps.setSurvey', (params) => {
    const nps = npses[name].instance.getRootComponent();
    const survey = params.npsSurvey;

    npses[name].instance.getRootComponent().reset();

    nps.setState({
      survey: {
        surveyId: survey.id,
        commentsQuestion: survey.commentsQuestion,
        highlightColor: survey.highlightColor,
        logoUrl: survey.logoUrl,
        question: survey.question,
        recepientId: survey.recipientId
      }
    });
  });

  mediator.channel.subscribe('nps.activate', function() {
    const nps = npses[name].instance.getRootComponent();

    if (!_.isNumber(nps.state.survey.surveyId)) {
      console.error('zE.activateNps() error: No survey available. Run zE.identify() first');
    } else {
      npses[name].instance.show(true);
    }
  });

  mediator.channel.subscribe('nps.show', function() {
    npses[name].instance.show();
  });

  mediator.channel.subscribe('nps.hide', function() {
    npses[name].instance.hide();
  });
}

export var nps = {
  create: create,
  get: get,
  render: render
};
