import styled from 'styled-components'
import { rem } from 'polished'
import { baseFontSize } from 'src/apps/messenger/features/themeProvider'
import AttachmentIcon from '@zendeskgarden/svg-icons/src/16/paperclip.svg'

const Container = styled.div`
  display: inline-flex;
  flex-direction: row;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${props => props.theme.messenger.space.md};
  justify-content: center;
  margin-top: ${props => props.theme.messenger.space.xs};
  margin-bottom: ${props => props.theme.messenger.space.xs};
`

const Icon = styled(AttachmentIcon)`
  width: ${rem(20, baseFontSize)};
  height: ${rem(20, baseFontSize)};
  align-self: center;
  margin-top: ${props => props.theme.messenger.space.xs};
  margin-bottom: ${props => props.theme.messenger.space.xs};
  margin-left: ${props => props.theme.messenger.space.xs};
  margin-right: ${props => props.theme.messenger.space.xxs};
  transform: scale(-1, 1) rotate(-45deg);
`

const Name = styled.a`
  font-size: ${props => props.theme.messenger.fontSizes.sm};
  color: ${props => props.theme.messenger.colors.action};
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  overflow-wrap: anywhere;
  font-weight: ${props => props.theme.fontWeights.semibold};
  &:hover,
  &:visited,
  &:active {
    color: ${props => props.theme.messenger.colors.action};
  }
`

const Size = styled.p`
  font-size: ${props => props.theme.messenger.fontSizes.sm};
  color: ${props => props.theme.messenger.colors.otherParticipantMessageText};
  line-height: ${props => props.theme.messenger.lineHeights.sm};
`

export { Container, Content, Icon, Name, Size }
