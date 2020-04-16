import styled from 'styled-components'
import { zdColorWhite, zdColorGrey800 } from '@zendeskgarden/css-variables'

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Bubble = styled.div`
  opacity: 0.9;
  border-radius: ${props => 30 / props.theme.fontSize}rem !important;
  box-shadow: 0 ${props => 1 / props.theme.fontSize}rem ${props => 10 / props.theme.fontSize}rem 0
    rgba(0, 0, 0, 0.2);
  max-width: 90%;
  height: ${props => 30 / props.theme.fontSize}rem;
  line-height: ${props => 30 / props.theme.fontSize}rem;
  background-color: ${zdColorWhite};

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-left: ${props => 15 / props.theme.fontSize}rem;
  padding-right: ${props => 12 / props.theme.fontSize}rem;
`

const Message = styled.div`
  margin-right: ${props => 7 / props.theme.fontSize}rem;
  margin-bottom: ${props => 1 / props.theme.fontSize}rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: ${zdColorGrey800};
`

export { Container, Bubble, Message }
