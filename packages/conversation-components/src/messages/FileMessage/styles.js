import { rem } from 'polished'
import styled from 'styled-components'
import AttachmentIcon from '@zendeskgarden/svg-icons/src/12/paperclip.svg'
import { MESSAGE_STATUS } from 'src/constants'
import dirStyles from 'src/utils/dirStyles'

const Container = styled.div`
  display: inline-flex;
  flex-direction: row;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-${dirStyles.right}: ${(props) => props.theme.messenger.space.md};
  justify-content: center;
  margin-top: ${(props) => props.theme.messenger.space.xs};
  margin-bottom: ${(props) => props.theme.messenger.space.xs};
`

const Icon = styled(AttachmentIcon)`
  width: ${(props) => rem(20, props.theme.messenger.baseFontSize)};
  height: ${(props) => rem(20, props.theme.messenger.baseFontSize)};
  align-self: center;
  margin-top: ${(props) => props.theme.messenger.space.xs};
  margin-bottom: ${(props) => props.theme.messenger.space.xs};
  margin-${dirStyles.left}: ${(props) => props.theme.messenger.space.xs};
  margin-${dirStyles.right}: ${(props) => props.theme.messenger.space.xxs};
`

const Name = styled.a`
  font-size: ${(props) => props.theme.messenger.fontSizes.sm};
  line-height: ${(props) => props.theme.messenger.lineHeights.sm};
  overflow-wrap: anywhere;
  font-weight: ${(props) => props.theme.messenger.fontWeights.semibold};
  color: ${(props) =>
    props.isPrimaryParticipant
      ? props.theme.messenger.colors.messageText
      : props.theme.messenger.colors.otherParticipantMessageText};
  ${(props) => props.status === MESSAGE_STATUS.failed && `color: ${props.theme.palette.red[700]};`}
  &:hover,
  &:visited,
  &:active,
  &:focus {
    color: ${(props) =>
      props.isPrimaryParticipant
        ? props.theme.messenger.colors.messageText
        : props.theme.messenger.colors.otherParticipantMessageText};
  }
`

const Size = styled.div`
  font-size: ${(props) => props.theme.messenger.fontSizes.sm};
  line-height: ${(props) => props.theme.messenger.lineHeights.sm};
`

export { Container, Content, Icon, Name, Size }
