import React from 'react/addons';

import { frameFactory } from 'embed/frameFactory';
import { Nps } from 'component/Nps';
import { mediator } from 'service/mediator';
import { transport } from 'service/transport';
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

  const npsSender = function(params, doneFn, failFn) {
    const payload = {
      path: '/embeddable/nps',
      method: 'post',
      params: params,
      callbacks: {
        done: doneFn,
        fail: failFn
      }
    };

    if (__DEV__) {
      setTimeout(doneFn, 1000);
    } else {
      transport.sendWithMeta(payload);
    }
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
          npsSender={npsSender}
          style={{width: '375px', margin: '15px'}} /> /* FIXME: css */
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

    if (survey && survey.id) {
      npses[name].instance.getRootComponent().reset();

      nps.setState({
        survey: {
          surveyId: survey.id,
          commentsQuestion: survey.commentsQuestion,
          highlightColor: survey.highlightColor,
          logoUrl: survey.logoUrl,
          question: survey.question,
          recipientId: survey.recipientId
        },
        surveyAvailable: true
      });
    } else {
      nps.setState({
        surveyAvailable: false
      });
    }
  });

  mediator.channel.subscribe('nps.activate', function() {
    const nps = npses[name].instance.getRootComponent();

    if (nps.state.surveyAvailable) {
      npses[name].instance.show(true);

    } else if (nps.state.surveyAvailable === null) {
      const err = new Error([
        'An error occurred in your use of the Zendesk Widget API:',
        'zE.activateNps()',
        'No survey available. Run zE.identify() first.',
        'Check out the Developer API docs to make sure you\'re using it correctly',
        'https://developer.zendesk.com/embeddables/docs/widget/api'
      ].join('\n\n'));
      err.special = true;

      throw err;
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
