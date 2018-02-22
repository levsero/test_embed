import { themeColor, colorFor, defaultColor } from './validate';
import { ColorMixer } from './mixer';

function generateUserCSS(color = defaultColor) {
  const mixer = new ColorMixer;
  const baseColor = themeColor(color);

  const buttonColorStr = colorFor('button', mixer.buttonColorFrom(baseColor));
  const buttonTextColorStr = mixer.foregroundColorFrom(buttonColorStr);

  const listColorStr = colorFor('resultLists', mixer.listColorFrom(baseColor));
  const listHighlightColorStr = mixer.highlightColor(listColorStr);

  const linkColorStr = colorFor('articleLinks', mixer.listColorFrom(baseColor));
  const linkTextColorStr = mixer.buttonColorFrom(linkColorStr);

  const launcherColorStr = colorFor('launcher', baseColor);
  const launcherTextColorStr = mixer.foregroundColorFrom(launcherColorStr);

  const headerColorStr = colorFor('header', baseColor);
  const headerTextColorStr = mixer.foregroundColorFrom(headerColorStr);
  const headerBackgroundColorStr = mixer.highlightColor(headerColorStr);

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
      background-color: ${mixer.highlightColor(buttonColorStr)} !important;
    }
    .u-userLauncherColor:not([disabled]) {
      background-color: ${launcherColorStr} !important;
      color: ${launcherTextColorStr} !important;
      fill: ${launcherTextColorStr} !important;
      svg {
        color: ${launcherTextColorStr} !important;
        fill: ${launcherTextColorStr} !important;
      }
    }
    .u-launcherColor:not([disabled]):hover {
      background-color: ${mixer.highlightColor(baseColor)} !important;
    }
    .u-userBorderColor:not([disabled]) {
      color: ${buttonColorStr} !important;
      background-color: transparent !important;
      border-color: ${buttonColorStr} !important;
    }
    .u-userBorderColor:not([disabled]):hover,
    .u-userBorderColor:not([disabled]):active,
    .u-userBorderColor:not([disabled]):focus {
      color: ${buttonTextColorStr} !important;
      background-color: ${buttonColorStr} !important;
      border-color: ${buttonColorStr} !important;
    }
    .u-userLinkColor a {
      color: ${linkColorStr} !important;
    }
    .u-userLinkColor a:hover {
      color: ${linkTextColorStr} !important;
    }
    .u-userStrokeColor {
      stroke: ${baseColor} !important;
    }
    .u-userHeaderColor {
      background: ${headerColorStr} !important;
      color: ${headerTextColorStr} !important;
    }
    .u-userHeaderButtonColor {
      fill: ${headerTextColorStr} !important;
    }
    .u-userHeaderButtonColor:hover,
    .u-userHeaderButtonColor:active,
    .u-userHeaderButtonColor:focus {
      background: ${headerBackgroundColorStr} !important;
      svg {
        background: ${headerBackgroundColorStr} !important;
      }
    }
  `);
}

function generateWebWidgetPreviewCSS(color) {
  const mixer = new ColorMixer;
  const baseColor = themeColor(color);

  return (`
    .u-userBackgroundColor:not([disabled]) {
      background-color: ${baseColor} !important;
    }
    .u-userBackgroundColor:not([disabled]):hover,
    .u-userBackgroundColor:not([disabled]):active,
    .u-userBackgroundColor:not([disabled]):focus {
      background-color: ${mixer.highlightColor(baseColor)} !important;
    }
  `);
}

export {
  generateUserCSS,
  generateWebWidgetPreviewCSS
};
