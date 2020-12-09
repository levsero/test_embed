import styled, { createGlobalStyle } from 'styled-components'
import CloseSVG from '@zendeskgarden/svg-icons/src/16/x-fill.svg'
import { frameMarginFromPage } from 'src/apps/messenger/constants'
import TailSVG from './label-tail.svg'

const LauncherLabelButton = styled.button`
  border: 0;
  background: ${props => props.theme.messenger.colors.otherParticipantMessage};
  color: ${props => props.theme.messenger.colors.otherParticipantMessageText};
  border-radius: 20px;
  box-shadow: 0 4px 10px 0 rgba(36, 36, 36, 0.2);
  display: flex;
  align-items: center;
  text-align: left;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`

const CloseButton = styled(LauncherLabelButton)`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  justify-content: center;
  opacity: 0;

  margin-right: 4px;

  ${props =>
    props.position === 'left' &&
    `
  margin-left: 4px;
  margin-right: 0px;
  `}

  &:hover,
  &[data-garden-focus-visible] {
    background-color: rgb(244, 246, 248);
    cursor: pointer;
  }

  body:hover & {
    opacity: 0.4;
  }

  &:focus,
  &:active,
  &:hover {
    opacity: 1 !important;
  }
`

const Container = styled.div`
  position: absolute;
  bottom: 30px;
  right: 0;

  // This just needs to be some number larger than what the launcher label can be
  width: 1000px;
  display: flex;
  justify-content: flex-end;
`

const Content = styled.div`
  align-items: flex-start;
  margin: 0 ${frameMarginFromPage};
  justify-content: flex-end;
  display: inline-flex;

  ${props =>
    props.position === 'left' &&
    `
    flex-direction: row-reverse;
  `}
`

const Label = styled(LauncherLabelButton)`
  padding: 10px 12px;
  background-color: rgb(244, 246, 248);
  font-size: ${props => props.theme.fontSizes.md};
  position: relative;
  line-height: ${props => props.theme.lineHeights.md};
  max-width: 240px;
  min-width: 120px;
`

const Tail = styled(TailSVG)`
  background-color: transparent;
  position: absolute;
  top: calc(100% + 2px);
  height: 12px;
  width: 12px;
  ${props => `${props.position === 'left' ? 'right' : 'left'}: 20px`};

  ${props =>
    props.position === 'left' &&
    `
    flex-direction: row-reverse;
    transform: scaleX(-1);
  `}
`

const TriangleShadow = styled.div`
  position: absolute;
  border-radius: 100%;
  top: calc(100% + 2px);
  height: 5px;
  width: 5px;
  box-shadow: 0 6px 10px 2px rgba(36, 36, 36, 0.2);
  ${props => `${props.position === 'left' ? 'right' : 'left'}: 20px`};
`

const CloseIcon = styled(CloseSVG)``

const GlobalStyles = createGlobalStyle`
  html {
    background-color: transparent;
  }
`

export { Container, Content, Label, CloseButton, Tail, CloseIcon, GlobalStyles, TriangleShadow }
