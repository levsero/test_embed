import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { AutomaticAnswers } from 'component/automaticAnswers/AutomaticAnswers';
import { frameFactory } from 'embed/frameFactory';
import { transitionFactory } from 'service/transitionFactory';
import { transport } from 'service/transport';
import { generateUserCSS } from 'utility/color';
import { isMobileBrowser } from 'utility/devices';
import { getDocumentHost } from 'utility/globals';
import { getURLParameterByName } from 'utility/pages';

const automaticAnswersCSS = require('./automaticAnswers.scss').toString();
const showFrameDelay = 2000;
const showSolvedFrameDelay = 500;
// 0 = New, 1 = Open, 2 = Pending, 6 = Hold
const unsolvedStatusIds = [0, 1, 2, 6];
// 3 = Solved, 4 = Closed
const solvedStatusIds = [3, 4];

let embed;

function create(name, config) {
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
    hideCloseButton: true,
    name: name,
    // Add offsetHeight to allow updateFrameSize to account for the box-shadow frame margin
    offsetHeight: (isMobileBrowser()) ? 10 : 50,
    transitions: {
      close: transitionSet.downHide(),
      upShow: transitionSet.upShow(),
      downHide: transitionSet.downHide()
    }
  };

  const closeFrame = (delay) => setTimeout(() => embed.instance.close({}), delay);

  const Embed = frameFactory(
    (params) => {
      return (
        <AutomaticAnswers
          ref='rootComponent'
          solveTicket={solveTicketFn}
          updateFrameSize={params.updateFrameSize}
          mobile={isMobileBrowser()}
          closeFrame={closeFrame} />
      );
    },
    frameParams
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
  const ticketId = getURLParameterByName('ticket_id');
  const token = getURLParameterByName('token');

  if (ticketId && token) {
    fetchTicketFn(ticketId, token);
  }
}

function fetchTicketFn(ticketId, token) {
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
    path: `/requests/automatic-answers/ticket/${ticketId}/fetch/token/${token}`,
    method: 'get',
    callbacks: {
      done: fetchTicketDone,
      fail: embed.instance.hide
    }
  };

  transport.automaticAnswersApiRequest(payload);
}

function solveTicketFn(ticketId, token, articleId, callbacks) {
  const payload = {
    path: `/requests/automatic-answers/ticket/${ticketId}/solve/token/${token}/article/${articleId}`,
    method: 'post',
    callbacks: callbacks
  };

  transport.automaticAnswersApiRequest(payload);
}

export const automaticAnswers = {
  create: create,
  get: get,
  render: render,
  postRender: postRender
};
