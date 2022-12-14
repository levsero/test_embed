import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-size: ${(props) => 14 / props.theme.fontSize}rem !important;
  align-items: center;
  justify-content: center;
  min-height: 70%;
  width: 100%;
  height: 100%;
  min-height: ${(props) => 300 / props.theme.fontSize}rem;
`

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 50%;
  justify-content: center;
  width: 100%;
`

const Heading = styled.h1`
  align-self: center;
  font-size: ${(props) => 22 / props.theme.fontSize}rem;
  letter-spacing: ${(props) => 0.35 / props.theme.fontSize}rem;
  line-height: ${(props) => 28 / props.theme.fontSize}rem;
`

const Message = styled.p`
  align-self: center;
  text-align: center;
  margin-top: ${(props) => 24 / props.theme.fontSize}rem !important;
  line-height: ${(props) => 20 / props.theme.fontSize}rem;
  width: 100%;
`

const StyledButton = styled(Button)`
  width: ${(props) => 160 / props.theme.fontSize}rem;
`

export { StyledButton as Button, Container, Heading, Message, SectionContainer }
