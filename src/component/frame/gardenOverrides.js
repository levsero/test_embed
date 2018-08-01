import { zdColorGrey400, zdColorGrey600 } from '@zendeskgarden/css-variables';
import { FONT_SIZE } from 'constants/shared';
import { css } from 'styled-components';
import { isMobileBrowser } from 'utility/devices';

/* eslint max-len: 0 */

const mobileOverrides = isMobileBrowser() ? css`
    font-size: ${15/FONT_SIZE}rem !important;
  `
  : '';

const checkboxHintMobileOverrides = isMobileBrowser() ? css`
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

const checkboxLabelMobileOverrides = isMobileBrowser() ? css`
    ${mobileOverrides}
    [dir='ltr'] & {
      padding-left: ${22/FONT_SIZE}rem !important;
    }

    [dir='rtl'] & {
      padding-right: ${22/FONT_SIZE}rem !important;
    }
    :focus {
      box-shadow: ${'0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important;'}
    }

    box-shadow: ${props => props.focused && `0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important`}
    border-color: ${props => props.focused && `${zdColorGrey600} !important`}

    &:before {
      width: ${14/FONT_SIZE}rem !important;
      height: ${14/FONT_SIZE}rem !important;
      margin-top: -0.05rem !important;
    }
  `
  : '';

const borderOverrides = isMobileBrowser() ? css`
    border-radius: ${4/FONT_SIZE}rem !important;
    border-width: ${1.1/FONT_SIZE}rem !important;
  `
  : '';

const selectOverrides = css`
  :hover, :focus {
    background-color: ${zdColorGrey400} !important;
  }

  box-shadow: ${props => props.focused && `inset 0 ${3/FONT_SIZE}rem 0 rgba(153,153,153, 0.4), inset 0 -${3/FONT_SIZE}rem 0 rgba(153,153,153, 0.4) !important`};
  background-color: ${props => props.focused && `${zdColorGrey400} !important`};
`;

const genericOverrides = css`
  :hover, :focus {
    border-color: ${zdColorGrey600} !important;
  }
  :focus {
    box-shadow: 0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important;
  }
  ${mobileOverrides}
`;

const inputOverrides = css`
  ${genericOverrides}
  ${borderOverrides}
`;

export default {
  'textfields.text_group': bottomMargin,
  'textfields.textarea': inputOverrides,
  'textfields.input': inputOverrides,
  'textfields.label': mobileOverrides,
  'textfields.hint': mobileOverrides,
  'checkboxes.checkbox_view': bottomMargin,
  'checkboxes.label': checkboxLabelMobileOverrides,
  'checkboxes.hint': checkboxHintMobileOverrides,
  'select.label': mobileOverrides,
  'select.hint': mobileOverrides,
  'select.select_view': css`
    ${genericOverrides}
    ${bottomMargin}
    box-shadow: ${props => props.focused && `0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important`}
    border-color: ${props => props.focused && `${zdColorGrey600} !important`}
    margin-bottom: ${20/FONT_SIZE}rem !important;
  `,
  'select.item': selectOverrides,
  'select.next_item': selectOverrides,
  'select.previous_item': selectOverrides
};
