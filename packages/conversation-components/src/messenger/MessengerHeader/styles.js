import styled from 'styled-components'
import { rem, rgba } from 'polished'
import { Avatar } from '@zendeskgarden/react-avatars'
import { IconButton } from '@zendeskgarden/react-buttons'
import CloseIcon from '@zendeskgarden/svg-icons/src/16/x-fill.svg'
import dirStyles from 'src/utils/dirStyles'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  font-family: ${(props) => props.theme.messenger.fontFamily};
  padding: ${(props) => props.theme.messenger.space.sixteen};
  background-color: ${(props) => props.theme.messenger.colors.primary};
  color: ${(props) => props.theme.messenger.colors.primaryText};
  word-break: break-word;
`

const CompactContainer = styled(Container)``

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: auto;
  color: ${(props) => props.theme.messenger.colors.primaryText};
  min-width: 0;

  &:not(:first-child) {
    padding-${dirStyles.left}: ${(props) => props.theme.messenger.space.sixteen};
  }
`

const StyledAvatar = styled(Avatar)`
  && {
    height: ${(props) => rem(36, props.theme.messenger.baseFontSize)} !important;
    width: ${(props) => rem(36, props.theme.messenger.baseFontSize)} !important;
    flex-shrink: 0;
    border-radius: 50%;
    margin-top: ${(props) => rem(4, props.theme.messenger.baseFontSize)} !important;
  }
`

const Title = styled.div`
  font-size: ${(props) => rem(18, props.theme.messenger.baseFontSize)};
  line-height: ${(props) => rem(24, props.theme.messenger.baseFontSize)};
  font-weight: ${(props) => props.theme.messenger.fontWeights.semibold};
  letter-spacing: ${(props) => rem(-0.45, props.theme.messenger.baseFontSize)};
`

const Description = styled.div`
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  line-height: ${(props) => props.theme.messenger.lineHeights.md};
  letter-spacing: ${(props) => rem(-0.15, props.theme.messenger.baseFontSize)};

  ${CompactContainer} & {
    text-wrap: avoid;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const StyledCloseIcon = styled(CloseIcon)``

const StyledIconButton = styled(IconButton)`
  &&& {
    width: ${(props) => props.theme.messenger.space.xl};
    height: ${(props) => props.theme.messenger.space.xl};
    color: ${(props) => props.theme.messenger.colors.primaryText};

    &:hover {
      background-color: ${(props) => rgba(props.theme.messenger.colors.primaryText, 0.2)};
    }

    &:active,
    &[aria-pressed='true'],
    &[aria-pressed='mixed'] {
      background-color: ${(props) => rgba(props.theme.messenger.colors.primaryText, 0.35)};
    }

    &[data-garden-focus-visible] {
      box-shadow: ${(props) =>
        props.theme.shadows.md(rgba(props.theme.messenger.colors.primaryText, 0.2))};
    }

    /* We have to style this as a child of the button in order to access the theme props */
    ${StyledCloseIcon} {
      color: ${(props) => props.theme.messenger.colors.primaryText};
      width: ${(props) => props.theme.messenger.iconSizes.md};
      height: ${(props) => props.theme.messenger.iconSizes.md};
    }
  }
`

const CloseIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-${dirStyles.left}: ${(props) => props.theme.messenger.space.sixteen};
  justify-content: center;
  height: ${(props) => props.theme.messenger.space.xxl};


`

export {
  StyledAvatar as Avatar,
  Title,
  Description,
  Container,
  CompactContainer,
  Details,
  StyledCloseIcon as CloseIcon,
  StyledIconButton as IconButton,
  CloseIconContainer,
}
