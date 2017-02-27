import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { AutomaticAnswersScreen } from 'component/automaticAnswers/AutomaticAnswers';
import { AutomaticAnswersDesktop } from 'component/automaticAnswers/AutomaticAnswersDesktop';
import { AutomaticAnswersMobile } from 'component/automaticAnswers/AutomaticAnswersMobile';
import { frameFactory } from 'embed/frameFactory';
import { automaticAnswersPersistence  } from 'service/automaticAnswersPersistence';
import { transitionFactory } from 'service/transitionFactory';
import { transport } from 'service/transport';
import { generateUserCSS } from 'utility/color';
import { isMobileBrowser } from 'utility/devices';
import { getDocumentHost } from 'utility/globals';
import { getURLParameterByName,
         getHelpCenterArticleId } from 'utility/pages';

const automaticAnswersCSS = require('./automaticAnswers.scss').toString();
// Anything less than 500 causes an animation bug.
const showFrameDelay = 500;
const showSolvedFrameDelay = 500;
// 0 = New, 1 = Open, 2 = Pending, 6 = Hold
const unsolvedStatusIds = [0, 1, 2, 6];
// 3 = Solved, 4 = Closed
const solvedStatusIds = [3, 4];

let embed;

function create(name, config, reduxStore) {
  let frameStyle = {
    position: 'fixed',
    bottom: 0,
    margin: 0,
    zIndex: 2147483647
  };

  if (isMobileBrowser()) {
    frameStyle = _.extend({}, frameStyle, {
      left: 0
    });
  } else {
    frameStyle = _.extend({}, frameStyle, {
      right: 0,
      marginBottom: 6,
      marginRight: 6
    });
  }

  const transitionSet = (isMobileBrowser())
                      ? transitionFactory.automaticAnswersMobile
                      : transitionFactory.automaticAnswersDesktop;

  const frameParams = {
    frameStyle: frameStyle,
    css: automaticAnswersCSS + generateUserCSS(),
    fullWidth: isMobileBrowser(),
    // We are not using the close button on EmbedWrapper because we need the flexibility
    // to show the close button on some screens, but not others.
    hideCloseButton: true,
    name: name,
    // Add offsetHeight to allow updateFrameSize to account for the box-shadow frame margin
    offsetHeight: (isMobileBrowser()) ? 20 : 30,
    offsetWidth: (isMobileBrowser()) ? 0 : 30,
    transitions: {
      close: transitionSet.downHide(),
      upShow: transitionSet.upShow(),
      downHide: transitionSet.downHide()
    }
  };

  const closeFrame = () => embed.instance.close({});

  const ComponentType = (isMobileBrowser()) ? AutomaticAnswersMobile : AutomaticAnswersDesktop;

  const Embed = frameFactory(
    (params) => {
      return (
        <ComponentType
          ref='rootComponent'
          solveTicket={solveTicket}
          markArticleIrrelevant={markArticleIrrelevant}
          updateFrameSize={params.updateFrameSize}
          mobile={isMobileBrowser()}
          closeFrame={closeFrame}
          initialScreen={getInitialScreen()}
          />
      );
    },
    frameParams,
    reduxStore
  );

  const position = (isMobileBrowser()) ? 'none' : 'right';

  embed = {
    component: <Embed visible={false} position={position} />,
    config: config
  };
}

function get() {
  return embed;
}

function render() {
  const element = getDocumentHost().appendChild(document.createElement('div'));

  embed.instance = ReactDOM.render(embed.component, element);
}

function postRender() {
  const articleId =  getHelpCenterArticleId();

  if (_.isNaN(articleId)) return;

  const authToken = automaticAnswersPersistence.getContext();

  if (!authToken) return;

  fetchTicket(authToken);
}

function fetchTicket(authToken) {
  const fetchTicketDone = (res) => {
    const ticket = res.body.ticket;
    const ticketUnsolved = _.includes(unsolvedStatusIds, ticket.status_id);
    const ticketSolved = _.includes(solvedStatusIds, ticket.status_id);
    const solvedUrlParameter = !!parseInt(getURLParameterByName('solved'));

    if (ticketUnsolved) {
      embed.instance.getRootComponent().updateTicket(ticket);

      setTimeout(() => embed.instance.show({ transition: 'upShow' }), showFrameDelay);
    } else if (ticketSolved && solvedUrlParameter) {
      embed.instance.getRootComponent().solveTicketDone();

      setTimeout(() => embed.instance.show({ transition: 'upShow' }), showSolvedFrameDelay);
    }
  };

  const payload = {
    path: '/requests/automatic-answers/embed/ticket/fetch',
    queryParams: {
      'auth_token': authToken,
      source: 'embed',
      mobile: isMobileBrowser()
    },
    method: 'get',
    callbacks: {
      done: fetchTicketDone,
      fail: embed.instance.hide
    }
  };

  transport.automaticAnswersApiRequest(payload);
}

function solveTicket(authToken, articleId, callbacks) {
  const payload = {
    path: '/requests/automatic-answers/embed/ticket/solve',
    queryParams: {
      source: 'embed',
      mobile: isMobileBrowser()
    },
    method: 'post',
    callbacks: callbacks
  };
  const formData = {
    'auth_token' : authToken,
    'article_id' : articleId
  };

  transport.automaticAnswersApiRequest(payload, formData);
}

function markArticleIrrelevant(authToken, articleId, reason, callbacks) {
  const payload = {
    path: '/requests/automatic-answers/embed/article/irrelevant',
    queryParams: {
      source: 'embed',
      mobile: isMobileBrowser()
    },
    method: 'post',
    callbacks: callbacks
  };
  const formData = {
    'auth_token' : authToken,
    'article_id' : articleId,
    'reason' : reason
  };

  transport.automaticAnswersApiRequest(payload, formData);
}

function getInitialScreen() {
  return (parseInt(getURLParameterByName('article_feedback'))
      ? AutomaticAnswersScreen.markAsIrrelevant
      : undefined);
}

export const automaticAnswers = {
  create: create,
  get: get,
  render: render,
  postRender: postRender,
  markArticleIrrelevant: markArticleIrrelevant,
  fetchTicket: fetchTicket,
  getInitialScreen: getInitialScreen
};
