import React from 'react';
import _ from 'lodash';

const splashContainerColor = (color) => {
  return `
    .src-component-launcher-ChatBadge-splashDisplayContainer {
      background-color: ${color} !important;
    }
  `;
};

export const splashCSS = ({ base }) => !_.isEmpty(base) && <style dangerouslySetInnerHTML={{ __html: splashContainerColor(base) }} />;

const labelBaseColor = (color) => {
  return `
    .src-component-launcher-ChatBadge-textContainer.u-userLauncherColor {
      background-color: ${color} !important;
    }
  `;
};

const labelTextColor = (color) => {
  return `
    .src-component-launcher-ChatBadge-textContainer.u-userLauncherColor {
      color: ${color} !important;
    }
  `;
};

export const labelCSS = ({ text, base }) => {
  if (_.isEmpty(base) && _.isEmpty(base)) return;
  const labelBase = !_.isEmpty(base) ? labelBaseColor(base) : '';
  const labelText = !_.isEmpty(text) ? labelTextColor(text) : '';

  return <style dangerouslySetInnerHTML={{ __html: (labelBase + labelText) }} />;
};

