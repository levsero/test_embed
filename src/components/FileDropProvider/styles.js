import styled from 'styled-components'
import { zdColorGrey300, zdColorGrey800, zdColorWhite } from '@zendeskgarden/css-variables'
import GardenAttachmentIcon from '@zendeskgarden/svg-icons/src/14/attachment.svg'

const Container = styled.div`
  position: relative;
`

const DropContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  z-index: 20;

  margin: ${props => 10 / props.theme.fontSize}rem;

  border-width: ${props => 2 / props.theme.fontSize}rem;
  border-color: ${zdColorGrey300};
  border-style: dashed;
  border-radius: ${props => 5 / props.theme.fontSize}rem;
  background-color: ${zdColorWhite};
  opacity: 0.9;

  display: flex;
  align-items: center;
  justify-content: center;
`

const DropInfo = styled.div`
  text-align: center;
  font-size: ${props => 15 / props.theme.fontSize}rem;
`

const Message = styled.div`
  margin-top: ${props => 10 / props.theme.fontSize}rem;
  font-weight: 700;
  color: ${zdColorGrey800};
`

const AttachmentIcon = styled(GardenAttachmentIcon)`
  height: ${props => 36 / props.theme.fontSize}rem;
  width: ${props => 36 / props.theme.fontSize}rem;
  color: ${props => props.theme.iconColor};
`

export { Container, DropContainer, DropInfo, Message, AttachmentIcon }
