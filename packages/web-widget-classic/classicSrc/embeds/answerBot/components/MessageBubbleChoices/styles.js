import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'
import { zdColorGrey100, zdColorGrey200, zdColorGrey800 } from '@zendeskgarden/css-variables'

const maxWidth = (props) => {
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
  border-left: ${1 / FONT_SIZE}rem ${zdColorGrey200} solid;
  border-right: ${1 / FONT_SIZE}rem ${zdColorGrey200} solid;
  margin-bottom: ${7 / FONT_SIZE}rem;
  max-width: ${maxWidth};

  ${(props) => (props.theme.rtl ? 'margin-right' : 'margin-left') + `: ${40 / FONT_SIZE}rem;`}
`

const Item = styled.div`
  cursor: pointer;
  &:hover {
    background-color: ${zdColorGrey100};
  }
  border-bottom: ${1 / FONT_SIZE}rem ${zdColorGrey200} solid;
  ${(props) => props.top && topBorder}
  ${(props) => props.bottom && bottomBorder}
`

const bottomBorder = `
  border-bottom-left-radius: ${16 / FONT_SIZE}rem;
  border-bottom-right-radius: ${16 / FONT_SIZE}rem;
`

const topBorder = `
  border-top: ${1 / FONT_SIZE}rem ${zdColorGrey200} solid;
  border-top-left-radius: ${16 / FONT_SIZE}rem;
  border-top-right-radius: ${16 / FONT_SIZE}rem;
`

const Header = styled.div`
  ${topBorder}
  background: ${zdColorGrey100};
  color: ${zdColorGrey800};
  padding: ${9 / FONT_SIZE}rem ${10 / FONT_SIZE}rem ${8 / FONT_SIZE}rem;
  line-height: ${15 / FONT_SIZE}rem;
`

export { Header, Container, Item }
