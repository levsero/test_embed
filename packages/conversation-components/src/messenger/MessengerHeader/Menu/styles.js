import { rem } from 'polished'
import styled, { css } from 'styled-components'
import MenuSvg from '@zendeskgarden/svg-icons/src/16/overflow-stroke.svg'
import { Item, Menu } from 'src/Dropdown'
import dirStyles from 'src/utils/dirStyles'

const animatedDuration = 0.2

const HeaderMenu = styled(Menu)`
  border-radius: ${(props) => rem(20, props.theme.baseFontSize)};
  border: 0;
`

const HeaderMenuItem = styled(Item)`
  &&& {
    padding: ${(props) => rem(14, props.theme.baseFontSize)}
      ${(props) => props.theme.messenger.space.sixteen};
    border-radius: ${(props) => rem(14, props.theme.baseFontSize)};
    display: flex;
    align-items: center;

    &:first-child {
      margin-top: ${(props) => rem(8, props.theme.baseFontSize)};
    }

    &:last-child {
      margin-bottom: ${(props) => rem(8, props.theme.baseFontSize)};
    }
  }
`

const ChannelIcon = styled.div`
  margin-${dirStyles.right}: ${(props) => props.theme.messenger.space.sixteen};
  height: ${(props) => props.theme.messenger.iconSizes.md};
  width: ${(props) => props.theme.messenger.iconSizes.md};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    height: ${(props) => props.theme.messenger.iconSizes.md};
    width: ${(props) => props.theme.messenger.iconSizes.md};
  }

  img {
    height: ${(props) => rem(14, props.theme.baseFontSize)};
    width: ${(props) => rem(14, props.theme.baseFontSize)};
  }
`

const MenuIcon = styled(MenuSvg)`
  transform: rotate(90deg);
`

const MenuTrigger = styled.div`
  transition: opacity ${animatedDuration}s ease-in;

  ${(props) => {
    if (props.state === 'entered') {
      return css`
        opacity: 1;
      `
    }
    return css`
      opacity: 0;
    `
  }};
`

export { HeaderMenu, HeaderMenuItem, MenuIcon, ChannelIcon, MenuTrigger }
