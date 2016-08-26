import Color from 'color';

import { settings }  from 'service/settings';

function generateUserCSS(color = '#659700') {
  if (settings.get('color.theme')) {
    color = settings.get('color.theme');
  }

  const highlightColor = generateHighlightColor(color);

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
    .u-userLinkColor a {
      color: ${color} !important;
    }
  `);
}

function generateNpsCSS(params) {
  if (params.color) {
    const highlightColor = generateHighlightColor(params.color);
    const constrastColor = generateContrastColor(params.color);

    return (`
      .u-userFillColor:not([disabled]) svg {
        fill: ${params.color} !important;
      }
      .u-userFillColorContrast:not([disabled]) svg {
        fill: ${constrastColor} !important;
      }
      .u-userTextColor:not([disabled]) {
        color: ${params.color} !important;
        fill: ${params.color} !important;
      }
      .u-userTextColorConstrast:not([disabled]) {
        color: ${constrastColor} !important;
        fill: ${constrastColor} !important;
      }
      .u-userBackgroundColor:not([disabled]) {
        background-color: ${params.color} !important;
      }
      .u-userBackgroundColor:not([disabled]):hover,
      .u-userBackgroundColor:not([disabled]):active,
      .u-userBackgroundColor:not([disabled]):focus {
        background-color: ${highlightColor} !important;
      }
      .u-userBorderColor:not([disabled]) {
        border-color: ${params.color} !important;
      }
      .u-userBorderColor:not([disabled]):hover,
      .u-userBorderColor:not([disabled]):active,
      .u-userBorderColor:not([disabled]):focus {
        border-color: ${highlightColor} !important;
      }
    `);
  } else {
    return '';
  }
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
  generateNpsCSS,
  generateUserCSS
};
