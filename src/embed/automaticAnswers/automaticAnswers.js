import React from 'react';
import ReactDOM from 'react-dom';

import { AutomaticAnswers } from 'component/automaticAnswers/AutomaticAnswers';
import { frameFactory } from 'embed/frameFactory';
import { getDocumentHost } from 'utility/globals';

let aaMap = {};

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

  aaMap[name] = {
    component: <Embed visible={false} />,
    config: config
  };
}

function get(name) {
  return aaMap[name];
}

function render(name) {
  const element = getDocumentHost().appendChild(document.createElement('div'));

  aaMap[name].instance = ReactDOM.render(aaMap[name].component, element);
}

export const automaticAnswers = {
  create: create,
  get: get,
  render: render
};
