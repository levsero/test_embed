import styled from 'styled-components'
import { Avatar } from '@zendeskgarden/react-avatars'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 0;
  padding: 16px;
  color: white;
  background-color: ${props => props.theme.messenger.brandColor};
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: auto;
  line-height: 24px;
  padding-left: 16px;
  color: ${props => props.theme.messenger.brandTextColor};
`

const StyledAvatar = styled(Avatar)`
  && {
    height: 48px;
    width: 48px;
  }
`

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
`

const Tagline = styled.div`
  font-size: 16px;
`

export { StyledAvatar as Avatar, Title, Tagline, Container, Details }
