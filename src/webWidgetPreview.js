import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { frameFactory } from 'embed/frameFactory';

const defaultOptions = {
  locale: 'en-US',
  color: '#659700',
  titleOption: 0
};

const renderWebWidgetPreview = (options) => {
  /* eslint-disable no-unused-vars */
  options = _.defaults({}, options, defaultOptions);

  if (!options.element) {
    throw new Error('A DOM element is required to render the Web Widget Preview into.');
  }

  let preview;
  const frameStyle = {
    position: 'relative',
    float: 'right'
  };
  const frameParams = {
    css: '',
    name: 'webWidgetPreview',
    frameStyle,
    disableOffsetHorizontal: true
  };

  const Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <div className="webwidgetpreview" ref='rootComponent' />
      );
    },
    frameParams
  ));

  preview = ReactDOM.render(<Embed />, options.element);

  const setColor = (color = defaultOptions.color) => {

  };

  const setTitle = (titleOption = defaultOptions.titleOption) => {

  };
  /* eslint-enable no-unused-vars */

  return {
    setColor,
    setTitle
  };
};

window.zE = _.extend(window.zE, { renderWebWidgetPreview });
