import { zdColorAluminum } from '@zendeskgarden/css-variables';
import { FONT_SIZE } from 'constants/shared';

export default {
  'textfields.textarea': `
    :hover, :focus {
      border-color: ${zdColorAluminum} !important;
    }

    :focus {
      box-shadow: 0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important;
    }
  `,
  'textfields.input': `
    :hover, :focus {
      border-color: ${zdColorAluminum} !important;
    }

    :focus {
      box-shadow: 0 0 0 ${3/FONT_SIZE}rem rgba(153,153,153, 0.4) !important;
    }
  `
};
