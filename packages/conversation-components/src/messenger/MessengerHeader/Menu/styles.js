import styled from 'styled-components'
import MenuSvg from '@zendeskgarden/svg-icons/src/16/overflow-stroke.svg'
import { Item } from 'src/Dropdown'
import { rem } from 'polished'
import { Menu } from 'src/Dropdown'
import dirStyles from 'src/utils/dirStyles'

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

    ${(props) =>
      props.channel === 'instagram' &&
      `
      height: ${rem(14, props.theme.baseFontSize)};
      width: ${rem(14, props.theme.baseFontSize)};
    `}
  }
`

const MenuIcon = styled(MenuSvg)`
  transform: rotate(90deg);
  color: ${(props) => props.theme.palette.white};
`

export { HeaderMenu, HeaderMenuItem, MenuIcon, ChannelIcon }
