import React from 'react/addons';
import _     from 'lodash';

import { frameFactory }     from 'embed/frameFactory';
import { Nps }              from 'component/Nps';
import { mediator }         from 'service/mediator';
import { store }            from 'service/persistence';
import { transport }        from 'service/transport';

import { document,
         getDocumentHost }  from 'utility/globals';
import { isMobileBrowser }  from 'utility/devices';

const npsCSS = require('./nps.scss');

let npses = {};

function create(name, config = {}) {
  const frameStyle = {
    position: 'fixed',
    bottom: '0',
    right: '0',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100% !important'
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
      transport.sendWithMeta(payload, 1);
    }
  };

  const frameParams = {
    frameStyle: frameStyle,
    css: npsCSS,
    hideCloseButton: false,
    name: name,
    fullscreenable: isMobileBrowser(),
    onClose(frame) {
      setDismissTimestamp(frame.getRootComponent().state.survey);
      mediator.channel.broadcast('nps.onClose');
    },
    onShow() {
      mediator.channel.broadcast('nps.onShow');
    }
  };
  let Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <Nps
          ref='rootComponent'
          setFrameSize={params.setFrameSize}
          updateFrameSize={params.updateFrameSize}
          npsSender={npsSender}
          mobile={isMobileBrowser()} />
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
      let newNpsSurveyState = _.extend(nps.state.survey, {
        surveyId: survey.id,
        commentsQuestion: survey.commentsQuestion,
        highlightColor: survey.highlightColor,
        logoUrl: survey.logoUrl,
        question: survey.question,
        recipientId: survey.recipientId,
        thankYou: survey.thankYou,
        youRated: survey.youRated,
        likelyLabel: survey.likelyLabel,
        notLikelyLabel: survey.notLikelyLabel,
        feedbackPlaceholder: survey.feedbackPlaceholder
      });
      npses[name].instance.getRootComponent().reset();

      nps.setState({
        survey: newNpsSurveyState,
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

    if (nps.state.surveyAvailable && shouldShow(nps.state.survey)) {
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

function getDismissTimestampKey(survey) {
  return [
    transport.getZendeskHost(),
    survey.surveyId,
    survey.recipientId,
    'dismiss-timestamp'
  ].join('-');
}

function shouldShow(survey = {}) {
  if (!survey.surveyId) {
    return false;
  }

  const dismissPeriod = 3 * 24 * 60 * 60 * 1000; // in ms
  const lastDismissed = store.get(getDismissTimestampKey(survey));

  if (!lastDismissed) { // no last dismissed timestamp exists
    return true;
  } else {
    const timeSinceLastDismissed = Date.now() - lastDismissed;
    return timeSinceLastDismissed > dismissPeriod;
  }
}

function setDismissTimestamp(survey) {
  const dismissTimestamp = new Date();
  dismissTimestamp.setMilliseconds(0);

  store.set(
    getDismissTimestampKey(survey),
    dismissTimestamp.getTime()
  );
}

export var nps = {
  create: create,
  get: get,
  render: render,
  shouldShow: shouldShow,
  setDismissTimestamp: setDismissTimestamp
};
