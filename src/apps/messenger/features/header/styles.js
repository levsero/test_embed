import styled, { css } from 'styled-components'
import { rgba } from 'polished'
import { Avatar } from '@zendeskgarden/react-avatars'
import { IconButton } from '@zendeskgarden/react-buttons'
import CloseIcon from '@zendeskgarden/svg-icons/src/16/x-fill.svg'

const onFullScreen = styles => props => {
  if (props.isFullScreen) {
    return styles
  }

  return ''
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  padding: ${props => props.theme.messenger.space.sixteen};
  background-color: ${props => props.theme.messenger.colors.primary};
  color: ${props => props.theme.messenger.colors.primaryText};

  ${onFullScreen(css`
    padding: ${props => props.theme.messenger.space.sm}
      ${props => props.theme.messenger.space.sixteen};
    align-items: center;
  `)}
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: auto;
  color: ${props => props.theme.messenger.colors.primaryText};
  min-width: 0;

  &:not(:first-child) {
    padding-left: ${props => props.theme.messenger.space.sixteen};
  }
`

const StyledAvatar = styled(Avatar)`
  && {
    height: ${props => props.theme.messenger.space.xxl};
    width: ${props => props.theme.messenger.space.xxl};
    flex-shrink: 0;
    border-radius: 50%;

    ${onFullScreen(css`
      height: ${props => props.theme.messenger.space.xl};
      width: ${props => props.theme.messenger.space.xl};
    `)}
  }
`

const Title = styled.div`
  font-size: ${props => props.theme.messenger.fontSizes.lg};
  line-height: ${props => props.theme.messenger.lineHeights.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};

  ${onFullScreen(css`
    font-size: ${props => props.theme.messenger.fontSizes.lg};
    line-height: ${props => props.theme.messenger.lineHeights.lg};
  `)}
`

const Description = styled.div`
  font-size: ${props => props.theme.messenger.space.sixteen};
  line-height: ${props => props.theme.messenger.lineHeights.lg};

  ${onFullScreen(css`
    text-wrap: avoid;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: ${props => props.theme.messenger.fontSizes.md};
    line-height: ${props => props.theme.messenger.lineHeights.md};
  `)}
`

const StyledCloseIcon = styled(CloseIcon)``

const StyledIconButton = styled(IconButton)`
  &&& {
    width: ${props => props.theme.messenger.space.xl};
    height: ${props => props.theme.messenger.space.xl};
    color: ${props => props.theme.messenger.colors.primaryText};

    ${onFullScreen(css`
      width: ${props => props.theme.messenger.space.xl};
      height: ${props => props.theme.messenger.space.xl};
    `)}

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

      ${onFullScreen(css`
        width: ${props => props.theme.messenger.iconSizes.md};
        height: ${props => props.theme.messenger.iconSizes.md};
      `)}
    }
  }
`

const CloseIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: ${props => props.theme.messenger.space.sixteen};
  justify-content: center;
  height: ${props => props.theme.messenger.space.xxl};

  ${onFullScreen(css`
    height: ${props => props.theme.messenger.space.xl};
  `)}
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
