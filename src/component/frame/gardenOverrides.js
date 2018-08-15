import { zdColorGrey400, zdColorGrey600, zdColorWhite } from '@zendeskgarden/css-variables';
import { FONT_SIZE } from 'constants/shared';
import { css } from 'styled-components';
import { isMobileBrowser } from 'utility/devices';
import { getThemeColor } from 'utility/color/validate';
import { getColorVariables } from 'utility/color/styles';

/* eslint max-len: 0 */
const isMobile = isMobileBrowser();

const mobileOverrides = isMobile ? css`
    font-size: ${15/FONT_SIZE}rem !important;
  `
  : '';

const checkboxHintMobileOverrides = isMobile ? css`
    ${mobileOverrides}
    [dir='ltr'] & {
      padding-left: ${22/FONT_SIZE}rem !important;
    }

    [dir='rtl'] & {
      padding-right: ${22/FONT_SIZE}rem !important;
    }
  `
  : '';

const bottomMargin = css`margin-bottom: ${20/FONT_SIZE}rem !important;`;

const borderOverrides = isMobile ? css`
    border-radius: ${4/FONT_SIZE}rem !important;
    border-width: ${1.1/FONT_SIZE}rem !important;
  `
  : '';

const checkboxLabelMobileOverrides = isMobile ? css`
    ${mobileOverrides}

    &:before {
      width: ${14/FONT_SIZE}rem !important;
      height: ${14/FONT_SIZE}rem !important;
      top: ${7/FONT_SIZE}rem !important;
      margin-top: -${4/FONT_SIZE}rem !important;
      ${borderOverrides}
    }

    [dir='ltr'] & {
      padding-left: ${22/FONT_SIZE}rem !important;
    }

    [dir='rtl'] & {
      padding-right: ${22/FONT_SIZE}rem !important;
    }
    :focus {
      box-shadow: 0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important;
    }

    box-shadow: ${props => props.focused && `0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important`};
    border-color: ${props => props.focused && `${zdColorGrey600} !important`};
  `
  : '';

const itemCheckOverrides = isMobile ? css`
  &:before {
    background-size: ${10/FONT_SIZE}rem !important;
    width: ${28/FONT_SIZE}rem !important;
    height: ${42/FONT_SIZE}rem !important;
  }
` : '';

const selectOverrides = css`
  :hover, :focus {
    background-color: ${zdColorGrey400} !important;
  }

  box-shadow: ${props => props.focused && `inset 0 ${3/FONT_SIZE}rem 0 rgba(153,153,153, 0.4), inset 0 -${3/FONT_SIZE}rem 0 rgba(153,153,153, 0.4) !important`};
  background-color: ${props => props.focused && `${zdColorGrey400} !important`};
  ${mobileOverrides}
  ${isMobile ? `padding: ${10/FONT_SIZE}rem ${25/FONT_SIZE}rem !important` : ''};
  ${itemCheckOverrides}
`;

const arrowOverrides = isMobile ? css`
  &::before {
    background-size: ${14/FONT_SIZE}rem !important;
    width: ${50/FONT_SIZE}rem !important;
    height: ${40/FONT_SIZE}rem !important;
  }
` : '';

const selectArrowOverrides = css`
  ${selectOverrides}
  ${arrowOverrides}
`;

const dropdownOverrides = isMobile ? css`
  ${mobileOverrides}
  max-height: ${300/FONT_SIZE}rem !important;
` : '';

const genericOverrides = css`
  :hover, :focus {
    border-color: ${props => !props.validation && `${zdColorGrey600} !important;`};
  }
  :focus {
    box-shadow: ${({ validation, bare }) => !validation && !bare  && `0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important`};
  }
  box-shadow: ${props => props.focused && !props.validation && `0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important`};
  border-color: ${props => props.focused && !props.validation && `${zdColorGrey600} !important`};

  ${mobileOverrides}
`;

const inputOverrides = css`
  ${genericOverrides}
  ${borderOverrides}
`;

const messageOverrides = isMobile ? css`
  ${mobileOverrides}
  margin-top: ${7/FONT_SIZE}rem !important;
  background-size: ${14/FONT_SIZE}rem !important;
  background-position-y: ${2/FONT_SIZE}rem !important;

  [dir='ltr'] & {
    padding-left: ${20/FONT_SIZE}rem !important;
  }

  [dir='rtl'] & {
    padding-right: ${20/FONT_SIZE}rem !important;
  }
` : '';

const getButtonOverrides = (colorVariables, themeColor) => {
  return css`
    height: ${38/FONT_SIZE}rem !important;
    font-size: ${isMobile && `${15/FONT_SIZE}rem`} !important;
    border-radius: ${isMobile && `${4/FONT_SIZE}rem`} !important;

    :not([disabled]) {
      background-color: ${props => (props.primary) ? themeColor : zdColorWhite} !important;
      color: ${props => (props.primary) ? colorVariables.buttonTextColorStr : themeColor} !important;
      border-color: ${themeColor} !important;

      &:hover, &:focus, &:active {
        background-color: ${props => (props.primary) ? colorVariables.buttonHighlightColorStr : themeColor} !important;
        color: ${colorVariables.buttonTextColorStr} !important;
      }
    }
  `;
};

const talkDropdownOverrides = {
  'textfields.input': genericOverrides,
  'select.select_view': css`
    width: ${60/FONT_SIZE}rem !important;
    min-height: ${38/FONT_SIZE}rem !important;
    padding: ${10/FONT_SIZE}rem ${10/FONT_SIZE}rem 0 !important;
    border-radius: ${4/FONT_SIZE}rem 0 0 ${4/FONT_SIZE}rem !important;
    border-width: 0 ${1/FONT_SIZE}rem 0 0 !important;
    box-shadow: none !important;
    &:before {
      background-position: center center !important;
      width: ${10/FONT_SIZE}rem !important;

      [dir='ltr'] & {
        right: ${10/FONT_SIZE}rem !important;
      }

      [dir='rtl'] & {
        left: ${10/FONT_SIZE}rem !important;
      }

      height: ${38/FONT_SIZE}rem !important;
    }
    :focus {
      box-shadow: none !important;
    }
  `,
  'select.item': selectOverrides,
};

function getGardenOverrides() {
  const themeColor = getThemeColor();
  const colorVariables = getColorVariables(themeColor);

  return {
    'textfields.text_group': bottomMargin,
    'textfields.textarea': inputOverrides,
    'textfields.input': inputOverrides,
    'textfields.label': mobileOverrides,
    'textfields.message': messageOverrides,
    'select.message': messageOverrides,
    'checkboxes.message': messageOverrides,
    'textfields.hint': mobileOverrides,
    'buttons.button': getButtonOverrides(colorVariables, themeColor),
    'checkboxes.checkbox_view': bottomMargin,
    'checkboxes.label': checkboxLabelMobileOverrides,
    'checkboxes.hint': checkboxHintMobileOverrides,
    'select.label': mobileOverrides,
    'select.hint': mobileOverrides,
    'select.select_group': bottomMargin,
    'select.select_view': css`
      ${genericOverrides}
      ${borderOverrides}
      box-shadow: ${props => props.focused && `0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important`}
      border-color: ${props => (props.focused || props.hovered) && `${zdColorGrey600} !important`}
      ${bottomMargin}
      ${arrowOverrides}
      min-height: ${isMobile ? `${42.5/FONT_SIZE}rem !important` : ''};
    `,
    'select.dropdown': dropdownOverrides,
    'select.item': selectOverrides,
    'select.next_item': selectArrowOverrides,
    'select.previous_item': selectArrowOverrides
  };
}

export { getGardenOverrides, talkDropdownOverrides };
