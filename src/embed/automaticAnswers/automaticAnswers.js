import React from 'react';
import ReactDOM from 'react-dom';

import { AutomaticAnswers } from 'component/automaticAnswers/AutomaticAnswers';
import { frameFactory } from 'embed/frameFactory';
import { getDocumentHost } from 'utility/globals';

let embed;

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

export const automaticAnswers = {
  create: create,
  get: get,
  render: render
};
