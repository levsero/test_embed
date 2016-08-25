import React from 'react';
import ReactDOM from 'react-dom';

import { AutomaticAnswers } from 'component/automaticAnswers/AutomaticAnswers';
import { frameFactory } from 'embed/frameFactory';
import { getDocumentHost } from 'utility/globals';

let aaEmbed;

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

  aaEmbed = {
    component: <Embed visible={false} />,
    config: config
  };
}

function get() {
  return aaEmbed;
}

function render() {
  const element = getDocumentHost().appendChild(document.createElement('div'));

  aaEmbed.instance = ReactDOM.render(aaEmbed.component, element);
}

export const automaticAnswers = {
  create: create,
  get: get,
  render: render
};
