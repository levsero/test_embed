import styled from 'styled-components'
import { Avatar } from '@zendeskgarden/react-avatars'
import dirStyles from 'src/utils/dirStyles'

const Container = styled(Avatar).attrs((props) => ({
  isSystem: props.isSquare,
}))`
  align-self: flex-end;
  flex-shrink: 0;

  && {
    width: ${(props) => props.theme.messenger.iconSizes.xl} !important;
    height: ${(props) => props.theme.messenger.iconSizes.xl} !important;
    margin-${dirStyles.right}: ${(props) => props.theme.messenger.space.xxs};
  }
`

const Image = styled.img``

export { Container, Image }
