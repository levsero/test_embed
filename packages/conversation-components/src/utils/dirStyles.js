import { css } from 'styled-components'

const swap = (ltrValue = '', rtlValue = '') => {
  return props => (props.theme.rtl ? rtlValue : ltrValue)
}

const left = props => swap('left', 'right')(props)

const right = props => swap('right', 'left')(props)

const borderRadius = (topLeft, topRight, bottomRight, bottomLeft) => {
  return css`
      border-top-${left}-radius: ${topLeft};
      border-top-${right}-radius: ${topRight};
      border-bottom-${right}-radius: ${bottomRight};
      border-bottom-${left}-radius: ${bottomLeft};
  `
}

const ltrOnly = styles => props => (!props.theme.rtl ? styles : '')

const rtlOnly = styles => props => (props.theme.rtl ? styles : '')

const dirStyles = {
  borderRadius,
  left,
  right,
  swap,
  ltrOnly,
  rtlOnly
}

export default dirStyles
