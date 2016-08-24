import React from 'react';
import ReactDOM from 'react-dom';

import { AutomaticAnswers } from 'component/automaticAnswers/AutomaticAnswers';
import { frameFactory } from 'embed/frameFactory';
import { getDocumentHost } from 'utility/globals';
import { transport } from 'service/transport';
import { getURLParameterByName } from 'utility/pages';

let embed;
const STATUS_SOLVED = 3;

function create(name, config) {
  const frameParams = {
    name: name
  };

  const Embed = React.createClass(frameFactory(
    () => {
      return (
        <AutomaticAnswers
          ref='rootComponent' />
      );
    },
    frameParams
  ));

  embed = {
    component: <Embed visible={false} />,
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
  const ticketId = getURLParameterByName('ticket_id'),
    token = getURLParameterByName('token');

  if (ticketId && token) {
    fetchTicketFn(ticketId, token);
  }
}

function fetchTicketFn(ticketId, token) {
  const payload = {
    path: `/requests/automatic-answers/ticket/${ticketId}/fetch/token/${token}`,
    method: 'get',
    callbacks: {
      done: fetchTicketDone,
      fail: fetchTicketFail
    }
  };

  transport.automaticAnswersApiRequest(payload);
}

function fetchTicketDone(res) {
  const ticket = res.body.ticket;

  if (ticket.status_id < STATUS_SOLVED) {
    // TODO - Pass ticket data to react component;
    embed.instance.show({});
  }
}

function fetchTicketFail() {
  embed.instance.hide({});
}

export const automaticAnswers = {
  create: create,
  get: get,
  render: render,
  postRender: postRender
};
