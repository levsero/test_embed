import { zdColorAluminum, zdColorPlatinum } from '@zendeskgarden/css-variables';
import { FONT_SIZE } from 'constants/shared';
import { css } from 'styled-components';

/* eslint max-len: 0 */

export default {
  'textfields.textarea': css`
    :hover, :focus {
      border-color: ${zdColorAluminum} !important;
    }

    :focus {
      box-shadow: 0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important;
    }
  `,
  'textfields.input': css`
    :hover, :focus {
      border-color: ${zdColorAluminum} !important;
    }

    :focus {
      box-shadow: 0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important;
    }
  `,
  'select.select_view': css`
    :hover, :focus {
      border-color: ${zdColorAluminum} !important;
    }

    :focus {
      box-shadow: 0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important;
    }
    box-shadow: ${props => props.focused && `0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important`}
    border-color: ${props => props.focused && `${zdColorAluminum} !important`}
  `,
  'select.item': css`
    :hover, :focus {
      background-color: ${zdColorPlatinum} !important;
    }

    box-shadow: ${props => props.focused && `inset 0 ${3/FONT_SIZE}rem 0 rgba(153,153,153, 0.4), inset 0 -${3/FONT_SIZE}rem 0 rgba(153,153,153, 0.4) !important`};
    background-color: ${props => props.focused && `${zdColorPlatinum} !important`};
  `
};
