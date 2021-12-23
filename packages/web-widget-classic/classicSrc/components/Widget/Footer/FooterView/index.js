import { FONT_SIZE } from 'classicSrc/constants/shared'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { zdColorGrey200 } from '@zendeskgarden/css-variables'

const padding = (props) => {
  switch (props.size) {
    case 'small':
      return `${10 / FONT_SIZE}rem ${20 / FONT_SIZE}rem`
    case 'large':
      return `${15 / FONT_SIZE}rem ${20 / FONT_SIZE}rem`
    case 'minimal':
      return '0'
  }
}

const shadow = () => {
  return `0 -${1 / FONT_SIZE}rem ${12 / FONT_SIZE}rem rgba(0,0,0,0.08)`
}

const FooterView = styled.footer`
  padding: ${padding};

  ${(props) =>
    props.shadow &&
    `
    border-top: ${1.1 / FONT_SIZE}rem solid ${zdColorGrey200};
    box-shadow: ${shadow()};
  `}
`

FooterView.propTypes = {
  size: PropTypes.oneOf(['small', 'large', 'minimal']),
  shadow: PropTypes.bool,
}

FooterView.defaultProps = {
  size: 'large',
}

export default FooterView

export { padding, shadow }
