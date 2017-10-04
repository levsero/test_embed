import generateColor from 'color';

import { settings } from 'service/settings';

const defaultColor = '#78A300';
const defaultLightYIQ = 178;
const almostWhiteYIQ = 240;

// Color manipulation and checks using color library
const darkenAndMixColor = (mixAmount, darkenAmount, mixColor = 'gray') => (color) => {
  return color.mix(generateColor(mixColor), mixAmount).darken(darkenAmount).hexString();
};
const darkenColor = (amount) => (color) => color.darken(amount).hexString();
const lightenColor = (amount) => (color) => color.lighten(amount).hexString();
const isLuminosityGreaterThan = (amount) => (color) => color.luminosity() > amount;

// Color checks
const isColorLight = (colorStr, threshold = defaultLightYIQ) => {
  const color = generateColor(colorStr);
  // YIQ equation from http://24ways.org/2010/calculating-color-contrast
  const rgb = color.rgb();
  const redChannel = rgb.r * 299;
  const greenChannel = rgb.g * 587;
  const blueChannel = rgb.b * 114;
  const yiq = (redChannel + greenChannel + blueChannel) / 1000;

  return yiq > threshold;
};
const getContrastColor = (colorStr, lightFn, darkFn, isLight = isColorLight(colorStr)) => {
  const color = generateColor(colorStr);

  return isLight ? darkFn(color) : lightFn(color);
};

// Color calculations
const buttonColor = (color) => {
  return getContrastColor(color, () => color, () => '#777', isColorLight(color, almostWhiteYIQ));
};
const buttonTextColor = (color) => getContrastColor(color, () => 'white', darkenAndMixColor(0.3, 0.5));
const listColor = (color) => getContrastColor(color, () => color, darkenAndMixColor(0.2, 0.5));
const borderColor = (color) => getContrastColor(color, () => 'white', () => 'black', isLuminosityGreaterThan(0.65));
const highlightColor = (color) => {
  return getContrastColor(color, lightenColor(0.15), darkenColor(0.1), isLuminosityGreaterThan(0.15));
};
const almostWhiteButtonTextColor = (color) => {
  return getContrastColor(color, () => buttonTextColor(color), () => 'white', isColorLight(color, almostWhiteYIQ));
};

function generateUserCSS(color = defaultColor) {
  if (validSettingsColor()) {
    color = validSettingsColor();
  } else {
    color = isValidHex(color) ? color : normalize(color);
  }

  const buttonColorStr = buttonColor(color);
  const listColorStr = listColor(color);
  const listHighlightColorStr = highlightColor(listColorStr);
  const buttonTextColorStr = almostWhiteButtonTextColor(color);
  const launcherTextColorStr = buttonTextColor(color);

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
      fill: ${listColorStr} !important;
    }
    .u-userFillColor:not([disabled]) svg path {
      fill: ${listColorStr} !important;
    }
    .u-userBackgroundColor:not([disabled]) {
      background-color: ${buttonColorStr} !important;
      color: ${buttonTextColorStr} !important;
    }
    .u-userBackgroundColor:not([disabled]):hover,
    .u-userBackgroundColor:not([disabled]):active,
    .u-userBackgroundColor:not([disabled]):focus {
      background-color: ${highlightColor(buttonColorStr)} !important;
    }
    .u-userLauncherColor:not([disabled]) {
      background-color: ${color} !important;
      color: ${launcherTextColorStr} !important;
      fill: ${launcherTextColorStr} !important;
      svg {
        color: ${launcherTextColorStr} !important;
        fill: ${launcherTextColorStr} !important;
      }
    }
    .u-launcherColor:not([disabled]):hover {
      background-color: ${highlightColor(color)} !important;
    }
    .u-userBorderColor:not([disabled]) {
      color: ${launcherTextColorStr} !important;
      background-color: transparent !important;
      border-color: ${buttonTextColorStr} !important;
    }
    .u-userBorderColor:not([disabled]):hover,
    .u-userBorderColor:not([disabled]):active,
    .u-userBorderColor:not([disabled]):focus {
      color: ${borderColor(color)} !important;
      background-color: ${listHighlightColorStr} !important;
      border-color: ${listHighlightColorStr} !important;
    }
    .u-userLinkColor a {
      color: ${listColorStr} !important;
    }
    .u-userStrokeColor {
      stroke: ${color} !important;
    }
    .u-userHeaderColor {
      background: ${color} !important;
      color: ${launcherTextColorStr} !important;
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

function normalize(color) {
  const hashlessValidRegex = /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i;

  return hashlessValidRegex.test(color) ? `#${color}` : defaultColor;
}

export {
  generateUserCSS,
  generateWebWidgetPreviewCSS,
  validSettingsColor
};
