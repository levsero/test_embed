import {
  zdColorGrey200,
  zdColorGrey400,
  zdColorGrey600,
  zdColorWhite
} from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'constants/shared'
import { css } from 'styled-components'
import { isMobileBrowser } from 'utility/devices'
import { getThemeColor } from 'utility/color/validate'
import { getWidgetColorVariables } from 'utility/color/styles'

/* eslint max-len: 0 */
const isMobile = isMobileBrowser()

const mobileOverrides = isMobile
  ? css`
      font-size: ${15 / FONT_SIZE}rem !important;
    `
  : ''

const labelOverrides = css`
  ${mobileOverrides}
  font-weight: 500 !important;
`

const checkboxHintMobileOverrides = isMobile
  ? css`
      ${mobileOverrides}
      [dir='ltr'] & {
        padding-left: ${22 / FONT_SIZE}rem !important;
      }

      [dir='rtl'] & {
        padding-right: ${22 / FONT_SIZE}rem !important;
      }
    `
  : ''

const bottomMargin = css`
  margin-bottom: ${16 / FONT_SIZE}rem !important;
`

const borderOverrides = isMobile
  ? css`
      border-radius: ${4 / FONT_SIZE}rem !important;
      border-width: ${1.1 / FONT_SIZE}rem !important;
    `
  : ''

const itemCheckOverrides = isMobile
  ? css`
      &:before {
        background-size: ${10 / FONT_SIZE}rem !important;
        width: ${28 / FONT_SIZE}rem !important;
        height: ${42 / FONT_SIZE}rem !important;
      }
    `
  : ''

const selectOverrides = css`
  :focus {
    background-color: ${zdColorGrey400} !important;
  }

  :hover {
    background-color: ${zdColorGrey200} !important;
  }

  box-shadow: ${props =>
    props.focused &&
    `inset 0 ${3 / FONT_SIZE}rem 0 rgba(153,153,153, 0.4), inset 0 -${3 /
      FONT_SIZE}rem 0 rgba(153,153,153, 0.4) !important`};
  background-color: ${props => props.focused && `${zdColorGrey400} !important`};
  ${mobileOverrides}
  ${isMobile ? `padding: ${10 / FONT_SIZE}rem ${25 / FONT_SIZE}rem !important` : ''};
  ${itemCheckOverrides}
`

const arrowOverrides = isMobile
  ? css`
      &::before {
        background-size: ${14 / FONT_SIZE}rem !important;
        width: ${50 / FONT_SIZE}rem !important;
        height: ${40 / FONT_SIZE}rem !important;
      }
    `
  : ''

const selectArrowOverrides = css`
  ${selectOverrides}
  ${arrowOverrides}
`

const genericOverrides = css`
  :hover,
  :focus {
    border-color: ${({ validation }) =>
      (!validation || validation === 'none') && `${zdColorGrey600} !important;`};
  }
  :focus {
    box-shadow: ${({ validation, bare }) =>
      (!validation || validation === 'none') &&
      !bare &&
      `0 0 0 ${3 / FONT_SIZE}rem rgba(153,153,153, 0.4) !important`};
  }
  box-shadow: ${({ focused, validation }) =>
    focused &&
    (!validation || validation === 'none') &&
    `0 0 0 ${3 / FONT_SIZE}rem rgba(153,153,153, 0.4) !important`};
  border-color: ${({ focused, validation }) =>
    focused && (!validation || validation === 'none') && `${zdColorGrey600} !important`};
  cursor: ${({ readOnly }) => (readOnly ? 'default' : 'auto')} ${mobileOverrides};
`

const inputOverrides = css`
  ${genericOverrides}
  ${borderOverrides}
`

const messageOverrides = isMobile
  ? css`
  ${mobileOverrides}
  margin-top: ${7 / FONT_SIZE}rem !important;
  background-size: ${14 / FONT_SIZE}rem !important;
  background-position-y: ${2 / FONT_SIZE}rem !important;

  [dir='ltr'] & {
    padding-left: ${20 / FONT_SIZE}rem !important;
  }

  [dir='rtl'] & {
    padding-right: ${20 / FONT_SIZE}rem !important;
  }
`
  : ''

const getButtonOverrides = colorVariables => {
  return css`
    ${props => {
      if (props.ignoreThemeOverride) {
        return ''
      }

      return css`
        height: ${38 / FONT_SIZE}rem !important;
        font-size: ${isMobile && `${15 / FONT_SIZE}rem`} !important;
        border-radius: ${props => !props.pill && isMobile && `${4 / FONT_SIZE}rem`} !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        line-height: ${36 / FONT_SIZE}rem !important;

        :not([disabled]) {
          background-color: ${props =>
            props.primary ? colorVariables.buttonColorStr : zdColorWhite} !important;
          color: ${props =>
            props.primary
              ? colorVariables.buttonTextColorStr
              : colorVariables.buttonColorStr} !important;
          border-color: ${colorVariables.buttonColorStr} !important;

          &:hover,
          &:focus,
          &:active {
            background-color: ${props =>
              !props.link &&
              !isMobile &&
              (props.primary
                ? colorVariables.buttonHighlightColorStr
                : colorVariables.buttonColorStr)} !important;
            color: ${props =>
              !props.link && !isMobile && colorVariables.buttonTextColorStr} !important;
          }
        }
      `
    }}
  `
}

const checkboxLabelOverrides = isMobile
  ? css`
      ${labelOverrides}
      &:before {
        width: ${14 / FONT_SIZE}rem !important;
        height: ${14 / FONT_SIZE}rem !important;
        top: ${8 / FONT_SIZE}rem !important;
        margin-top: -${4 / FONT_SIZE}rem !important;
        ${borderOverrides}
      }

      :hover:before {
        border-color: ${zdColorGrey600} !important;
      }

      [dir='ltr'] & {
        padding-left: ${22 / FONT_SIZE}rem !important;
      }

      [dir='rtl'] & {
        padding-right: ${22 / FONT_SIZE}rem !important;
      }
      :focus {
        box-shadow: 0 0 0 ${3 / FONT_SIZE}rem rgba(153, 153, 153, 0.4) !important;
      }

      box-shadow: ${props =>
        props.focused && `0 0 0 ${3 / FONT_SIZE}rem rgba(153,153,153, 0.4) !important`};
      border-color: ${props => props.focused && `${zdColorGrey600} !important`};
    `
  : css`
      ${labelOverrides}
      /* The & represents the element itself, we specific it 4 times to override Garden styling due to its heavy specificity. */
      &&&&:hover:before {
        border-color: ${zdColorGrey600} !important;
      }

      &:before {
        box-shadow: ${props =>
          props.focused && `0 0 0 ${3 / FONT_SIZE}rem rgba(153,153,153, 0.4) !important`};
        border-color: ${zdColorGrey400} !important;
      }
      &:active:before,
      &:focus:before {
        background-color: rgba(153, 153, 153, 0.4) !important;
        border-color: ${zdColorGrey600} !important;
      }
    `

const checkboxInputOverrides = themeColor => {
  return css`
    &:checked ~ :before {
      background-color: ${themeColor} !important;
      border-color: ${zdColorGrey600} !important;
    }
  `
}

function getGardenOverrides(colors) {
  const themeColor = getThemeColor()
  const colorVariables = getWidgetColorVariables({ ...themeColor, ...colors })

  return {
    'forms.text_area': inputOverrides,
    'forms.text_input': inputOverrides,
    'forms.text_label': labelOverrides,
    'forms.label': labelOverrides,
    'forms.message': messageOverrides,
    'dropdowns.message': messageOverrides,
    'checkboxes.message': messageOverrides,
    'textfields.hint': mobileOverrides,
    'buttons.button': getButtonOverrides(colorVariables),
    'forms.check_label': checkboxLabelOverrides,
    'forms.check_input': checkboxInputOverrides(themeColor),
    'forms.check_hint': checkboxHintMobileOverrides,
    'dropdowns.label': mobileOverrides,
    'dropdowns.hint': mobileOverrides,
    'dropdowns.select': css`
      ${genericOverrides}
      ${borderOverrides}
      box-shadow: ${props =>
        props.focused && `0 0 0 ${3 / FONT_SIZE}rem rgba(153,153,153, 0.4) !important`};
      border-color: ${props => (props.focused || props.hovered) && `${zdColorGrey600} !important`};
      ${bottomMargin}
      ${arrowOverrides}
      min-height: ${isMobile ? `${42.5 / FONT_SIZE}rem !important` : ''};
    `,
    'dropdowns.item': selectOverrides,
    'dropdowns.next_item': selectArrowOverrides
  }
}

export { getGardenOverrides, mobileOverrides, selectOverrides, genericOverrides }
