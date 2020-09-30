import styled from 'styled-components'
import { Avatar } from '@zendeskgarden/react-avatars'

const Container = styled(Avatar)`
  width: ${props => props.theme.messenger.iconSizes.xl};
  height: ${props => props.theme.messenger.iconSizes.xl};
  margin-right: ${props => props.theme.messenger.space.xxs};
  align-self: flex-end;
`

const Image = styled.img``

export { Container, Image }