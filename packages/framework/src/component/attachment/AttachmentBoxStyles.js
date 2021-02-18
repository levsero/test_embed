import styled from 'styled-components'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'
import PaperclipLargeIcon from '@zendeskgarden/svg-icons/src/14/attachment.svg'

const Container = styled.div`
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
`

const DropzoneChild = styled.div`
  &&& {
    position: relative !important;
    text-align: center !important;
    top: 50%;
    transform: translateY(-50%);
    font-size: ${(props) => 15 / props.theme.fontSize}rem;
  }
`

const DropzoneChildLabel = styled.p`
  &&& {
    margin-top: ${(props) => 10 / props.theme.fontSize}rem !important;
    font-weight: 700;
    color: ${zdColorGrey800};
  }
`

const StyledPaperclipIcon = styled(PaperclipLargeIcon)`
  padding-right: 0;

  path {
    color: ${(props) => props.theme.iconColor};
  }
  min-width: ${(props) => 36 / props.theme.fontSize}rem;
  min-height: ${(props) => 36 / props.theme.fontSize}rem;
  height: ${(props) => 36 / props.theme.fontSize}rem;
  width: ${(props) => 36 / props.theme.fontSize}rem;
  transform: rotate(45deg) scaleX(-1);
`

export { Container, DropzoneChild, DropzoneChildLabel, StyledPaperclipIcon as PaperclipIcon }
