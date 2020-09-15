import styled from 'styled-components'
import TempIcon from 'src/apps/messenger/icons/widget-icon_avatar.svg'

const Icon = styled(TempIcon)`
  width: ${props => props.theme.messenger.iconSizes.xl};
  height: ${props => props.theme.messenger.iconSizes.xl};
  margin-right: ${props => props.theme.messenger.space.xxs};
  align-self: flex-end;
`

const SpaceFiller = styled.div`
  width: ${props => props.theme.messenger.iconSizes.xl};
  height: ${props => props.theme.messenger.iconSizes.xl};
  margin-right: ${props => props.theme.messenger.space.xxs};
  align-self: flex-end;
`

export { Icon, SpaceFiller }
