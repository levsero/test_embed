import React from 'react/addons';
import _     from 'lodash';

import { frameFactory }     from 'embed/frameFactory';
import { Nps }              from 'component/Nps';
import { mediator }         from 'service/mediator';
import { store }            from 'service/persistence';
import { transport }        from 'service/transport';
import { setScrollKiller,
         revertWindowScroll } from 'utility/scrollHacks';
import { transitionFactory } from 'service/transitionFactory';
import { document,
         getDocumentHost } from 'utility/globals';
import { isMobileBrowser } from 'utility/devices';

const npsCSS = require('./nps.scss');

let npses = {};

function create(name, config) {
  let containerStyle;
  let frameStyle = {
    position: 'fixed',
    bottom: 0
  };

  if (isMobileBrowser()) {
    frameStyle = _.extend({}, frameStyle, {
      right: '0',
      margin: 0,
      width: '100%'
    });
  } else {
    containerStyle = { width: 620, margin: 15 };
    frameStyle = _.extend({}, frameStyle, {
      left: '50%',
      marginLeft: -310,
      width: 620
    });
  }

  const npsSender = (params, doneFn, failFn) => {
    const payload = {
      path: '/embeddable/nps',
      method: 'post',
      params: params,
      callbacks: {
        done: doneFn,
        fail: failFn
      }
    };

    transport.sendWithMeta(payload);
  };

  const onShow = () => {
    mediator.channel.broadcast('nps.onShow');
  };

  const onClose = (frame) => {
    if (isMobileBrowser()) {
      setTimeout(() => {
        setScrollKiller(false);
        revertWindowScroll();
      }, 0);
    }
    setDismissTimestamp(frame.getRootComponent().state.survey);
    mediator.channel.broadcast('nps.onClose');
  };

  const transitionSet = (isMobileBrowser())
                      ? transitionFactory.npsMobile
                      : transitionFactory.npsDesktop;

  const frameParams = {
    frameStyle: frameStyle,
    css: npsCSS,
    hideCloseButton: false,
    name: name,
    fullscreenable: isMobileBrowser(),
    onClose,
    onShow,
    transitions: {
      upShow: transitionSet.upShow(),
      downHide: transitionSet.downHide(),
      close: transitionSet.downHide()
    }
  };

  const Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <Nps
          ref='rootComponent'
          setFrameSize={params.setFrameSize}
          updateFrameSize={params.updateFrameSize}
          setOffsetHorizontal={params.setOffsetHorizontal}
          npsSender={npsSender}
          mobile={isMobileBrowser()}
          style={containerStyle} />
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
    const survey = params.npsSurvey || {};

    if (survey.highlightColor) {
      npses[name].instance.setHighlightColor(survey.highlightColor);
    }

    if (survey && survey.id) {
      npses[name].instance.getRootComponent().reset();
      nps.setState({
        survey: _.extend({}, nps.state.survey, survey),
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
      npses[name].instance.show({transition: 'upShow'});
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

  mediator.channel.subscribe('nps.show', function(options = {}) {
    npses[name].instance.show(options);
  });

  mediator.channel.subscribe('nps.hide', function(options = {}) {
    npses[name].instance.hide(options);
  });
}

function getDismissTimestampKey(survey) {
  return [
    transport.getZendeskHost(),
    survey.id,
    survey.recipientId,
    'dismiss-timestamp'
  ].join('-');
}

function shouldShow(survey = {}) {
  if (!survey.id) {
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

export const nps = {
  create: create,
  get: get,
  render: render,
  shouldShow: shouldShow,
  setDismissTimestamp: setDismissTimestamp
};
