import styled from 'styled-components'
import { rgba } from 'polished'
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
    border-radius: 50%;
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
    color: ${props => props.theme.messenger.colors.primaryText};

    &:hover {
      background-color: ${props => rgba(props.theme.messenger.colors.primaryText, 0.2)};
    }

    &:active,
    &[aria-pressed='true'],
    &[aria-pressed='mixed'] {
      background-color: ${props => rgba(props.theme.messenger.colors.primaryText, 0.35)};
    }

    &[data-garden-focus-visible] {
      box-shadow: ${props =>
        props.theme.shadows.md(rgba(props.theme.messenger.colors.primaryText, 0.2))};
    }

    /* We have to style this as a child of the button in order to access the theme props */
    ${StyledCloseIcon} {
      color: ${props => props.theme.messenger.colors.primaryText};
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
