import { themeColor, colorFor, defaultColor } from './validate';
import { ColorMixer } from './mixer';
import { FONT_SIZE } from 'constants/shared';
import { settings } from 'service/settings';

function getWidgetColorVariables(color = defaultColor) {
  const bypassA11y = settings.get('color.bypassAccessibilityRequirement');
  const mixer = new ColorMixer(
    themeColor(color) || defaultColor,
    { bypassA11y: bypassA11y }
  );

  const baseColor = mixer.getBaseColor();
  const baseHighlightColor = mixer.highlight(baseColor);

  const buttonColorStr = colorFor('button', mixer.getButtonColor());
  const buttonHighlightColorStr = mixer.highlight(buttonColorStr);
  const buttonTextColorStr = mixer.foregroundColorFrom(buttonColorStr);

  const listColorStr = colorFor('resultLists', mixer.getListColor());
  const listHighlightColorStr = mixer.highlight(listColorStr);

  const linkColorStr = colorFor('articleLinks', mixer.getListColor());
  const linkTextColorStr = mixer.uiElementColorFrom(linkColorStr);

  const headerColorStr = colorFor('header', baseColor);
  const headerTextColorStr = mixer.foregroundColorFrom(headerColorStr);
  const headerFocusRingColorStr = mixer.alpha(headerColorStr, 0.4);
  const headerBackgroundColorStr = mixer.highlight(headerColorStr);

  return {
    baseColor,
    baseHighlightColor,
    buttonColorStr,
    buttonHighlightColorStr,
    buttonTextColorStr,
    listColorStr,
    listHighlightColorStr,
    linkColorStr,
    linkTextColorStr,
    headerColorStr,
    headerTextColorStr,
    headerFocusRingColorStr,
    headerBackgroundColorStr
  };
}

function getLauncherColorVariables(color = defaultColor) {
  const bypassA11y = settings.get('color.bypassAccessibilityRequirement');
  const mixer = new ColorMixer(
    themeColor(color) || defaultColor,
    { bypassA11y: bypassA11y }
  );

  const baseColor = mixer.getBaseColor();

  const launcherColorStr = colorFor('launcher', baseColor);
  const launcherTextColorStr = colorFor(
    'launcherText',
    mixer.foregroundColorFrom(launcherColorStr)
  );
  const launcherFocusRingColorStr = mixer.alpha(launcherTextColorStr, 0.4);

  return {
    launcherColorStr,
    launcherTextColorStr,
    launcherFocusRingColorStr
  };
}

function generateUserWidgetCSS(color = defaultColor) {
  const colorVariables = getWidgetColorVariables(color);

  return (`
    .u-userTextDecorationColor {
      text-decoration-color: ${colorVariables.baseColor} !important;
    }
    .u-userColor {
      color: ${colorVariables.baseColor} !important;
    }
    .rf-CheckboxGroup__checkbox:checked + span:before,
    .u-userTextColor:not([disabled]) {
      color: ${colorVariables.listColorStr} !important;
      fill: ${colorVariables.listColorStr} !important;
    }
    .u-userTextColor:not([disabled]):hover,
    .u-userTextColor:not([disabled]):active,
    .u-userTextColor:not([disabled]):focus {
      color: ${colorVariables.listHighlightColorStr} !important;
      fill: ${colorVariables.listHighlightColorStr} !important;
    }
    .u-userFillColor:not([disabled]) svg {
      fill: ${colorVariables.listColorStr} !important;
    }
    .u-userFillColor:not([disabled]) svg path {
      fill: ${colorVariables.listColorStr} !important;
    }
    .u-userFillCustomColor svg path.customColor,
    .u-userFillCustomColor svg rect.customColor {
      fill: ${colorVariables.listColorStr} !important;
    }
    .u-userBackgroundColorNoHover {
      background-color: ${colorVariables.buttonColorStr} !important;
      color: ${colorVariables.buttonTextColorStr} !important;
    }
    .u-userBackgroundColor:not([disabled]) {
      background-color: ${colorVariables.buttonColorStr} !important;
      color: ${colorVariables.buttonTextColorStr} !important;
    }
    .u-userBackgroundColor:not([disabled]):hover,
    .u-userBackgroundColor:not([disabled]):active,
    .u-userBackgroundColor:not([disabled]):focus {
      background-color: ${colorVariables.buttonHighlightColorStr} !important;
    }
    .u-userBorderColor:not([disabled]) {
      color: ${colorVariables.buttonColorStr} !important;
      background-color: transparent !important;
      border-color: ${colorVariables.buttonColorStr} !important;
    }
    .u-userBorderColor:not([disabled]):hover,
    .u-userBorderColor:not([disabled]):active,
    .u-userBorderColor:not([disabled]):focus {
      color: ${colorVariables.buttonTextColorStr} !important;
      background-color: ${colorVariables.buttonColorStr} !important;
      border-color: ${colorVariables.buttonColorStr} !important;
    }
    .u-userLinkColor a {
      color: ${colorVariables.linkColorStr} !important;
    }
    .u-userLinkColor a:hover {
      color: ${colorVariables.linkTextColorStr} !important;
    }
    .u-userStrokeColor {
      stroke: ${colorVariables.baseColor} !important;
    }
    .u-userHeaderColor {
      background: ${colorVariables.headerColorStr} !important;
      color: ${colorVariables.headerTextColorStr} !important;
    }
    .u-userHeaderButtonColor {
      fill: ${colorVariables.headerTextColorStr} !important;
    }
    .u-userHeaderButtonColor:hover,
    .u-userHeaderButtonColor:active,
    .u-userHeaderButtonColor:focus {
      background: ${colorVariables.headerBackgroundColorStr} !important;
      svg {
        background: ${colorVariables.headerBackgroundColorStr} !important;
      }
    }
    .u-userHeaderButtonColorMobile {
      fill: ${colorVariables.headerTextColorStr} !important;
    }
  `);
}

function generateUserLauncherCSS(color = defaultColor) {
  const colorVariables = getLauncherColorVariables(color);

  return (`
    .u-userLauncherColor:not([disabled]) {
      background-color: ${colorVariables.launcherColorStr} !important;
      color: ${colorVariables.launcherTextColorStr} !important;
      fill: ${colorVariables.launcherTextColorStr} !important;
      svg {
        color: ${colorVariables.launcherTextColorStr} !important;
        fill: ${colorVariables.launcherTextColorStr} !important;
      }
    }
    .u-userLauncherColor:not([disabled]):focus {
      box-shadow: inset 0 0 0 ${3/FONT_SIZE}rem ${colorVariables.launcherFocusRingColorStr} !important;
    }
  `);
}

function generateWebWidgetPreviewCSS(color) {
  const colorVariables = getWidgetColorVariables(color);

  return (`
    .u-userBackgroundColor:not([disabled]) {
      background-color: ${colorVariables.buttonColorStr} !important;
      color: ${colorVariables.buttonTextColorStr} !important;
    }
    .u-userBackgroundColor:not([disabled]):hover,
    .u-userBackgroundColor:not([disabled]):active,
    .u-userBackgroundColor:not([disabled]):focus {
      background-color: ${colorVariables.baseHighlightColor} !important;
    }
    .u-userHeaderColor {
      background: ${colorVariables.headerColorStr} !important;
      color: ${colorVariables.headerTextColorStr} !important;
    }
    .u-userHeaderButtonColor {
      fill: ${colorVariables.headerTextColorStr} !important;
    }
    .u-userHeaderButtonColor:hover,
    .u-userHeaderButtonColor:active,
    .u-userHeaderButtonColor:focus {
      background: ${colorVariables.headerBackgroundColorStr} !important;
      svg {
        background: ${colorVariables.headerBackgroundColorStr} !important;
      }
    }
    .u-userBackgroundColorNoHover {
      background-color: ${colorVariables.buttonColorStr} !important;
      color: ${colorVariables.buttonTextColorStr} !important;
    }
  `);
}

export {
  generateUserWidgetCSS,
  generateUserLauncherCSS,
  generateWebWidgetPreviewCSS,
  getWidgetColorVariables
};
