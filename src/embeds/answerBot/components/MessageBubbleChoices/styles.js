import styled from 'styled-components'
import {
  zdColorOil,
  zdColorAntiFlashWhite,
  zdColorWhiteSmoke,
  zdColorPlatinum
} from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'

const maxWidth = props => {
  switch (props.size) {
    case 'small':
      return `${219 / FONT_SIZE}rem`
    case 'large':
      return `${258 / FONT_SIZE}rem`
    case 'fill':
      return '100%'
  }
  return '100%'
}

const Container = styled.div`
  display: inline-block;
  white-space: pre-wrap;
  border-radius: ${16 / FONT_SIZE}rem;
  margin-left: ${40 / FONT_SIZE}rem;
  border-left: ${1 / FONT_SIZE}rem ${zdColorPlatinum} solid;
  border-right: ${1 / FONT_SIZE}rem ${zdColorPlatinum} solid;
  margin-bottom: ${7 / FONT_SIZE}rem;
  max-width: ${maxWidth};

  ${props =>
    props.theme.rtl &&
    `margin-left: 0;
    margin-right: ${40 / FONT_SIZE}rem;`}
`

const Item = styled.div`
  cursor: pointer;
  &:hover {
    background-color: ${zdColorWhiteSmoke};
  }
  border-bottom: ${1 / FONT_SIZE}rem ${zdColorPlatinum} solid;
  ${props => props.top && topBorder}
  ${props => props.bottom && bottomBorder}
`

const bottomBorder = `
  border-bottom-left-radius: ${16 / FONT_SIZE}rem;
  border-bottom-right-radius: ${16 / FONT_SIZE}rem;
`

const topBorder = `
  border-top: ${1 / FONT_SIZE}rem ${zdColorPlatinum} solid;
  border-top-left-radius: ${16 / FONT_SIZE}rem;
  border-top-right-radius: ${16 / FONT_SIZE}rem;
`

const Header = styled.div`
  ${topBorder}
  background: ${zdColorAntiFlashWhite};
  color: ${zdColorOil};
  padding: ${9 / FONT_SIZE}rem ${10 / FONT_SIZE}rem ${8 / FONT_SIZE}rem;
  line-height: ${15 / FONT_SIZE}rem;
`

export { Header, Container, Item }
