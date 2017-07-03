import Color from 'color';

import { settings } from 'service/settings';

const defaultColor = '#78A300';

function generateUserCSS(color = defaultColor) {
  if (validSettingsColor()) {
    color = validSettingsColor();
  }

  const highlightColor = generateHighlightColor(color);
  const constrastColor = generateContrastColor(color);

  return (`
    .rf-CheckboxGroup__checkbox:checked + span:before,
    .u-userTextColor:not([disabled]) {
      color: ${color} !important;
      fill: ${color} !important;
    }
    .u-userFillColor:not([disabled]) svg {
      fill: ${color} !important;
    }
    .u-userFillColor:not([disabled]) svg path {
      fill: ${color} !important;
    }
    .u-userTextColor:not([disabled]):hover,
    .u-userTextColor:not([disabled]):active,
    .u-userTextColor:not([disabled]):focus {
      color: ${highlightColor} !important;
      fill: ${highlightColor} !important;
    }
    .u-userBackgroundColor:not([disabled]) {
      background-color: ${color} !important;
    }
    .u-userBackgroundColor:not([disabled]):hover,
    .u-userBackgroundColor:not([disabled]):active,
    .u-userBackgroundColor:not([disabled]):focus {
      background-color: ${highlightColor} !important;
    }
    .u-userBorderColor:not([disabled]) {
      color: ${color} !important;
      background-color: transparent !important;
      border-color: ${color} !important;
    }
    .u-userBorderColor:not([disabled]):hover,
    .u-userBorderColor:not([disabled]):active,
    .u-userBorderColor:not([disabled]):focus {
      color: ${constrastColor} !important;
      background-color: ${highlightColor} !important;
      border-color: ${highlightColor} !important;
    }
    .u-userLinkColor a {
      color: ${color} !important;
    }
    .u-userStrokeColor {
      stroke: ${color} !important;
    }
  `);
}

function generateWebWidgetPreviewCSS(color) {
  if (validSettingsColor()) {
    color = validSettingsColor();
  }

  const highlightColor = generateHighlightColor(color);

  return (`
    .u-userBackgroundColor:not([disabled]) {
      background-color: ${color} !important;
    }
    .u-userBackgroundColor:not([disabled]):hover,
    .u-userBackgroundColor:not([disabled]):active,
    .u-userBackgroundColor:not([disabled]):focus {
      background-color: ${highlightColor} !important;
    }
  `);
}

function validSettingsColor() {
  const settingsColor = settings.get('color.theme');
  const settingsColorValid = settingsColor &&
                             isValidHex(settingsColor);

  return settingsColorValid ? settingsColor : null;
}

function isValidHex(color) {
  const validRegex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

  return validRegex.test(color);
}

function generateContrastColor(colorStr) {
  try {
    const color = Color(colorStr);

    return (color.luminosity() <= 0.35)
         ? 'white'
         : 'black';
  } catch (e) {
    return;
  }
}

function generateHighlightColor(colorStr) {
  try {
    const color = Color(colorStr);

    return (color.luminosity() > 0.15)
         ? color.darken(0.1).rgbString()
         : color.lighten(0.15).rgbString();
  } catch (e) {
    return;
  }
}

export {
  generateUserCSS,
  generateWebWidgetPreviewCSS,
  validSettingsColor
};
