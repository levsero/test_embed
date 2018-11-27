import React from 'react';

const splashContainerColor = (color) => {
  return `
    .src-component-launcher-ChatBadge-splashDisplayContainer {
      background-color: ${color.base} !important;
    }
  `;
};

export const splashCSS = (color) => <style dangerouslySetInnerHTML={{ __html: splashContainerColor(color) }} />;

const labelColor = (color) => {
  return `
    .src-component-launcher-ChatBadge-textContainer.u-userLauncherColor {
      background-color: ${color.base} !important;
      color: ${color.text} !important;
    }
  `;
};

export const labelCSS = (color) => <style dangerouslySetInnerHTML={{ __html: labelColor(color) }} />;

