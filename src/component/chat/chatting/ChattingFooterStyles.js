import styled from 'styled-components'
import { FONT_SIZE } from 'src/constants/shared'
import { zdColorWhite, zdColorGrey300 } from '@zendeskgarden/css-variables'
import { FooterView } from 'components/Widget'

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: ${8 / FONT_SIZE}rem;
`

const ContainerMobile = styled.div`
  display: flex;
  align-items: center;
  box-shadow: 0 ${-1 / FONT_SIZE}rem 0 0 ${zdColorGrey300};
  padding: ${10 / FONT_SIZE}rem 0;
`

const Footer = styled(FooterView)`
  box-shadow: 0 0 ${12 / FONT_SIZE}rem ${8 / FONT_SIZE}rem ${zdColorWhite};
  z-index: 1;
`

const IconContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  transform: tranlsateY(0px, 33%);

  button {
    margin-right: ${3 / FONT_SIZE}rem;
  }
`

const InputContainerMobile = styled.div`
  flex-grow: 1;
`

export { BottomRow, ContainerMobile, Footer, IconContainer, InputContainerMobile }
