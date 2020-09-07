import styled from 'styled-components'
import { transparentize } from 'polished'
import { Avatar } from '@zendeskgarden/react-avatars'
import { IconButton } from '@zendeskgarden/react-buttons'
import CloseIcon from '@zendeskgarden/svg-icons/src/16/x-fill.svg'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 0;
  background: rgb(23, 73, 77);
  padding: ${props => props.theme.messenger.fontSizes.xs};
  color: white;
  background-color: ${props => props.theme.messenger.brandColor};
  flex-shrink: 0;
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: auto;
  color: ${props => props.theme.messenger.brandTextColor};
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  padding-left: ${props => props.theme.messenger.space.xs};
`

const StyledAvatar = styled(Avatar)`
  && {
    height: ${props => props.theme.messenger.space.lg};
    width: ${props => props.theme.messenger.space.lg};
  }
`

const Title = styled.div`
  font-size: ${props => props.theme.messenger.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
`

const Tagline = styled.div`
  font-size: ${props => props.theme.messenger.fontSizes.md};
`

const StyledCloseIcon = styled(CloseIcon)``

const StyledIconButton = styled(IconButton)`
  width: ${props => props.theme.messenger.space.xl} !important;
  height: ${props => props.theme.messenger.space.xl} !important;
  color: ${props => props.theme.messenger.brandColor} !important;

  :focus {
    border: ${props =>
      `${props.theme.borders.md} ${transparentize(
        '0.65',
        props.theme.messenger.brandMessageColor
      )} !important`};
  }
  :active,
  :hover {
    background-color: ${props =>
      transparentize('0.92', props.theme.messenger.brandMessageColor)} !important;
  }

  /* We have to style this as a child of the button in order to access the theme props */
  ${StyledCloseIcon} {
    color: ${props => props.theme.messenger.brandMessageColor};
    width: ${props => props.theme.messenger.iconSizes.md} !important;
    height: ${props => props.theme.messenger.iconSizes.md} !important;
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
  Tagline,
  Container,
  Details,
  StyledCloseIcon as CloseIcon,
  StyledIconButton as IconButton,
  CloseIconContainer
}
