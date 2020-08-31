import styled from 'styled-components'
import AvatarIcon from 'src/asset/icons/widget-icon_avatar.svg'

const Container = styled.div`
  margin: 5px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  background-color: ${props => props.theme.messenger.brandColor};
`

const Avatar = styled(AvatarIcon)`
  width: 100%;
  height: 100%;
  stroke: ${props => props.theme.messenger.brandTextColor};
`

export { Avatar, Container }
