import Color from 'color';

import { settings } from 'service/settings';

const defaultColor = '#78A300';

// Color manipulation and checks using color library
const darkenAndMixColor = (mixAmount, darkenAmount, mixColor = 'gray') => (color) => {
  return color.mix(Color(mixColor), mixAmount).darken(darkenAmount).rgbString();
};
const darkenColor = (amount) => (color) => color.darken(amount).rgbString();
const lightenColor = (amount) => (color) => color.darken(amount).rgbString();
const getLuminosity = (amount) => (color) => color.luminosity() > amount;

// Color checks
const isColorLight = (colorStr) => {
  const color = Color(colorStr);
  // YIQ equation from http://24ways.org/2010/calculating-color-contrast
  const rgb = color.rgb();
  const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

  return yiq > 178;
};
const getLightOrDark = (colorStr, light, dark, isLight = isColorLight(colorStr)) => {
  const color = Color(colorStr);

  return isLight ? dark(color) : light(color);
};

// Color calculations
const buttonTextColor = (color) => getLightOrDark(color, () => 'white', darkenAndMixColor(0.3, 0.5));
const listColor = (color) => getLightOrDark(color, () => color, darkenAndMixColor(0.2, 0.4));
const highlightColor = (color) => getLightOrDark(color, lightenColor(0.15), darkenColor(0.1), getLuminosity(0.15));
const constrastColor = (color) => getLightOrDark(color, () => 'white', () => 'black', getLuminosity(0.65));
const border = (color) => getLightOrDark(color, () => 'none', (c) => `1px solid ${darkenAndMixColor(0.2, 0.2)(c)}`);

function generateUserCSS(color = defaultColor) {
  if (validSettingsColor()) {
    color = validSettingsColor();
  }

  const listColorStr = listColor(color);
  const listHighlightColorStr = highlightColor(listColor);
  const buttonTextColorStr = buttonTextColor(color);

  return (`
    .rf-CheckboxGroup__checkbox:checked + span:before,
    .u-userTextColor:not([disabled]) {
      color: ${listColorStr} !important;
      fill: ${listColorStr} !important;
    }
    .u-userTextColor:not([disabled]):hover,
    .u-userTextColor:not([disabled]):active,
    .u-userTextColor:not([disabled]):focus {
      color: ${listHighlightColorStr} !important;
      fill: ${listHighlightColorStr} !important;
    }
    .u-userFillColor:not([disabled]) svg {
      fill: ${color} !important;
    }
    .u-userFillColor:not([disabled]) svg path {
      fill: ${color} !important;
    }
    .u-userBackgroundColor:not([disabled]) {
      background-color: ${color} !important;
      color: ${buttonTextColorStr} !important;
      fill: ${buttonTextColorStr} !important;
      border: ${border(color)} !important;
      svg {
        color: ${buttonTextColorStr} !important;
        fill: ${buttonTextColorStr} !important;
      }
    }
    .u-userBackgroundColor:not([disabled]):hover,
    .u-userBackgroundColor:not([disabled]):active,
    .u-userBackgroundColor:not([disabled]):focus {
      background-color: ${highlightColor(color)} !important;
    }
    .u-userBorderColor:not([disabled]) {
      color: ${buttonTextColorStr} !important;
      background-color: transparent !important;
      border-color: ${buttonTextColorStr} !important;
    }
    .u-userBorderColor:not([disabled]):hover,
    .u-userBorderColor:not([disabled]):active,
    .u-userBorderColor:not([disabled]):focus {
      color: ${constrastColor(color)} !important;
      background-color: ${listHighlightColorStr} !important;
      border-color: ${listHighlightColorStr} !important;
    }
    .u-userLinkColor a {
      color: ${color} !important;
    }
    .u-userStrokeColor {
      stroke: ${color} !important;
    }
    .u-userHeaderColor {
      background: ${color} !important;
      color: ${buttonTextColorStr} !important;
    }
  `);
}

function generateWebWidgetPreviewCSS(color) {
  if (validSettingsColor()) {
    color = validSettingsColor();
  }

  return (`
    .u-userBackgroundColor:not([disabled]) {
      background-color: ${color} !important;
    }
    .u-userBackgroundColor:not([disabled]):hover,
    .u-userBackgroundColor:not([disabled]):active,
    .u-userBackgroundColor:not([disabled]):focus {
      background-color: ${highlightColor(color)} !important;
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

export {
  generateUserCSS,
  generateWebWidgetPreviewCSS,
  validSettingsColor
};
