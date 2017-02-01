import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

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
const showFrameDelay = 200;
const showSolvedFrameDelay = 500;
// 0 = New, 1 = Open, 2 = Pending, 6 = Hold
const unsolvedStatusIds = [0, 1, 2, 6];
// 3 = Solved, 4 = Closed
const solvedStatusIds = [3, 4];

let embed;

function create(name, config, reduxStore) {
  let closeTimeoutId = null;
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
    offsetHeight: (isMobileBrowser()) ? 10 : 30,
    offsetWidth: (isMobileBrowser()) ? 0 : 30,
    transitions: {
      close: transitionSet.downHide(),
      upShow: transitionSet.upShow(),
      downHide: transitionSet.downHide()
    }
  };

  // The onClose in frameFactory param is being called after the embed has been hidden
  // but we need to clear the timeout before it is being closed.
  const closeFrame = (delay) => {
    if (!delay) {
      if (closeTimeoutId) {
        closeTimeoutId = clearTimeout(closeTimeoutId);
      }
      embed.instance.close({});
    } else if (!closeTimeoutId) {
      closeTimeoutId = setTimeout(() => embed.instance.close({}), delay);
    }
  };

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
          closeFrame={closeFrame} />
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

  fetchTicketFn(authToken);
}

function fetchTicketFn(authToken) {
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
    path: `/requests/automatic-answers/embed/ticket/fetch?auth_token=${authToken}`,
    method: 'get',
    callbacks: {
      done: fetchTicketDone,
      fail: embed.instance.hide
    }
  };

  transport.automaticAnswersApiRequest(payload);
}

function solveTicket(authToken, articleId, callbacks) {
  const path = `/requests/automatic-answers/embed/ticket/solve`;
  const queryParams = `?source=embed&mobile=${isMobileBrowser()}`;
  const payload = {
    path: path + queryParams,
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
  const path = `/requests/automatic-answers/embed/article/irrelevant`;
  const queryParams = `?source=embed&mobile=${isMobileBrowser()}`;
  const payload = {
    path: path + queryParams,
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

export const automaticAnswers = {
  create: create,
  get: get,
  render: render,
  postRender: postRender,
  markArticleIrrelevant: markArticleIrrelevant
};
