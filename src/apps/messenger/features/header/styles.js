import styled from 'styled-components'
import { transparentize } from 'polished'
import { Avatar } from '@zendeskgarden/react-avatars'
import { IconButton } from '@zendeskgarden/react-buttons'
import CloseIcon from '@zendeskgarden/svg-icons/src/16/x-fill.svg'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  padding: ${props => props.theme.messenger.space.sixteen};
  background-color: ${props => props.theme.messenger.colors.primary};
  color: ${props => props.theme.messenger.colors.primaryText};
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: auto;
  color: ${props => props.theme.messenger.colors.primaryText};
  padding-left: ${props => props.theme.messenger.space.sixteen};
`

const StyledAvatar = styled(Avatar)`
  && {
    height: ${props => props.theme.messenger.space.xxl};
    width: ${props => props.theme.messenger.space.xxl};
    flex-shrink: 0;
  }
`

const Title = styled.div`
  font-size: ${props => props.theme.messenger.fontSizes.lg};
  line-height: ${props => props.theme.messenger.lineHeights.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
`

const Description = styled.div`
  font-size: ${props => props.theme.messenger.space.sixteen};
  line-height: ${props => props.theme.messenger.lineHeights.lg};
`

const StyledCloseIcon = styled(CloseIcon)``

const StyledIconButton = styled(IconButton)`
  &&& {
    width: ${props => props.theme.messenger.space.xl};
    height: ${props => props.theme.messenger.space.xl};
    color: ${props => props.theme.messenger.colors.primary};

    :focus {
      border: ${props =>
        `${props.theme.borders.md} ${transparentize(
          '0.65',
          props.theme.messenger.colors.otherParticipantMessage
        )}`};
    }
    :active,
    :hover {
      background-color: ${props =>
        transparentize('0.92', props.theme.messenger.colors.otherParticipantMessage)};
    }

    /* We have to style this as a child of the button in order to access the theme props */
    ${StyledCloseIcon} {
      color: ${props => props.theme.messenger.colors.otherParticipantMessageText};
      width: ${props => props.theme.messenger.iconSizes.md};
      height: ${props => props.theme.messenger.iconSizes.md};
    }
  }
`

const CloseIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: ${props => props.theme.messenger.space.sixteen};
  justify-content: center;
  height: ${props => props.theme.messenger.space.xxl};
`

export {
  StyledAvatar as Avatar,
  Title,
  Description,
  Container,
  Details,
  StyledCloseIcon as CloseIcon,
  StyledIconButton as IconButton,
  CloseIconContainer
}
