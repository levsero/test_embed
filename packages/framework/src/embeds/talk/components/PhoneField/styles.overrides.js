import { css } from 'styled-components'
import { FONT_SIZE } from 'constants/shared'
import { genericOverrides, mobileOverrides, selectOverrides } from 'component/frame/gardenOverrides'

const overrides = {
  'forms.input': genericOverrides,
  'dropdowns.input': css`
    width: 1px !important;
    min-height: auto;
  `,
  'dropdowns.faux_input': css`
    width: ${53 / FONT_SIZE}rem !important;
    min-height: ${38 / FONT_SIZE}rem !important;
    padding: ${10 / FONT_SIZE}rem ${10 / FONT_SIZE}rem 0 !important;
    border-radius: ${4 / FONT_SIZE}rem 0 0 ${4 / FONT_SIZE}rem !important;
    border-width: 0 ${1 / FONT_SIZE}rem 0 0 !important;
    box-shadow: none !important;
    &:before {
      background-position: center center !important;
      width: ${10 / FONT_SIZE}rem !important;

      [dir='ltr'] & {
        right: ${10 / FONT_SIZE}rem !important;
      }

      [dir='rtl'] & {
        left: ${10 / FONT_SIZE}rem !important;
      }

      height: ${38 / FONT_SIZE}rem !important;
      background-size: ${14 / FONT_SIZE}rem !important;
    }
    :focus {
      box-shadow: none !important;
    }
  `,
  'dropdowns.item': selectOverrides,
  'dropdowns.label': mobileOverrides,
}

export default overrides
