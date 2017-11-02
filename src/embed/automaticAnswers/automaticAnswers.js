import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { AutomaticAnswersScreen } from 'component/automaticAnswers/AutomaticAnswers';
import { AutomaticAnswersDesktop } from 'component/automaticAnswers/AutomaticAnswersDesktop';
import { AutomaticAnswersMobile } from 'component/automaticAnswers/AutomaticAnswersMobile';
import { frameFactory } from 'embed/frameFactory';
import { automaticAnswersPersistence  } from 'service/automaticAnswersPersistence';
import { transitionFactory } from 'service/transitionFactory';
import { http } from 'service/transport';
import { generateUserCSS } from 'utility/color';
import { isMobileBrowser } from 'utility/devices';
import { getDocumentHost } from 'utility/globals';
import { getURLParameterByName,
         getHelpCenterArticleId } from 'utility/pages';

const automaticAnswersCSS = require('./automaticAnswers.scss').toString();
// Anything less than 500 causes an animation bug.
const showFrameDelay = 500;
const showSolvedFrameDelay = 500;
const defaultCloseFrameDelay = 30000;

// 3 = Solved, 4 = Closed
const solvedStatusIds = [3, 4];

let embed;
let closeTimeoutId;

function create(name, config = {}, reduxStore) {
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

  const zdColorOil = '#333333';

  const frameParams = {
    frameStyle: frameStyle,
    css: automaticAnswersCSS + generateUserCSS(zdColorOil),
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

  const ComponentType = (isMobileBrowser()) ? AutomaticAnswersMobile : AutomaticAnswersDesktop;

  const Embed = frameFactory(
    (params) => {
      return (
        <ComponentType
          ref='rootComponent'
          solveTicket={solveTicket}
          cancelSolve={cancelSolve}
          markArticleIrrelevant={markArticleIrrelevant}
          updateFrameSize={params.updateFrameSize}
          mobile={isMobileBrowser()}
          closeFrame={closeFrame}
          closeFrameAfterDelay={closeFrameAfterDelay}
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
  const articleId = getHelpCenterArticleId();

  if (_.isNaN(articleId)) return;

  const authToken = automaticAnswersPersistence.getContext();

  if (!authToken) return;

  fetchTicket(authToken, articleId);
}

function closeFrame() {
  if (closeTimeoutId) {
    closeTimeoutId = clearTimeout(closeTimeoutId);
  }
  embed.instance.close({});
}

function closeFrameAfterDelay(closeFrameDelay = defaultCloseFrameDelay) {
  closeTimeoutId = setTimeout(closeFrame, closeFrameDelay);
}

function fetchTicket(authToken, articleId) {
  const fetchTicketDone = (res) => {
    const ticket = res.body.ticket;
    const ticketSolved = _.includes(solvedStatusIds, ticket.status_id);
    const ticketSolvedPending = ticket.is_solved_pending || false;
    const solvedUrlParameter = !!getURLParameterByName('solved');

    if (ticketSolved) {
      if (solvedUrlParameter) {
        embed.instance.getRootComponent().ticketClosed();
        return setTimeout(() => embed.instance.show({ transition: 'upShow' }), showSolvedFrameDelay);
      } else {
        return;
      }
    }

    if (ticketSolvedPending) {
      if (solvedUrlParameter) {
        embed.instance.getRootComponent().closedWithUndo();
        return setTimeout(() => embed.instance.show({ transition: 'upShow' }), showSolvedFrameDelay);
      } else {
        return;
      }
    }

    embed.instance.getRootComponent().updateTicket(ticket);
    setTimeout(() => embed.instance.show({ transition: 'upShow' }), showFrameDelay);
  };

  const payload = {
    path: '/requests/automatic-answers/embed/ticket/fetch',
    queryParams: {
      'auth_token': authToken,
      source: 'embed',
      mobile: isMobileBrowser(),
      'article_id': articleId
    },
    method: 'get',
    callbacks: {
      done: fetchTicketDone,
      fail: embed.instance.hide
    }
  };

  http.automaticAnswersApiRequest(payload);
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

  http.automaticAnswersApiRequest(payload, formData);
}

function cancelSolve(authToken, callbacks) {
  const payload = {
    path: '/requests/automatic-answers/embed/ticket/cancel_solve',
    queryParams: {
      source: 'embed',
      mobile: isMobileBrowser()
    },
    method: 'post',
    callbacks: callbacks
  };
  const formData = { 'auth_token' : authToken };

  http.automaticAnswersApiRequest(payload, formData);
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

  http.automaticAnswersApiRequest(payload, formData);
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
  closeFrame: closeFrame,
  closeFrameAfterDelay: closeFrameAfterDelay,
  markArticleIrrelevant: markArticleIrrelevant,
  fetchTicket: fetchTicket,
  getInitialScreen: getInitialScreen
};
