import styled from 'styled-components'
import { FooterView } from 'components/Widget'

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: ${props => 8 / props.theme.fontSize}rem;
`

const Footer = styled(FooterView)`
  z-index: 2;
`

const IconContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  transform: translate(0px, 33%);

  button {
    margin-right: ${props => 3 / props.theme.fontSize}rem;
  }
`

export { BottomRow, Footer, IconContainer }
