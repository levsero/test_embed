import styled from 'styled-components'
import { Avatar } from '@zendeskgarden/react-avatars'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 0;
  background: rgb(23, 73, 77);
  padding: ${props => props.theme.messenger.fontSizes.xs};
  color: white;
  background-color: ${props => props.theme.messenger.brandColor};
  flex-shrink: 0;
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: auto;
  color: ${props => props.theme.messenger.brandTextColor};
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  padding-left: ${props => props.theme.messenger.space.xs};
`

const StyledAvatar = styled(Avatar)`
  && {
    height: ${props => props.theme.messenger.space.lg};
    width: ${props => props.theme.messenger.space.lg};
  }
`

const Title = styled.div`
  font-size: ${props => props.theme.messenger.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
`

const Tagline = styled.div`
  font-size: ${props => props.theme.messenger.fontSizes.md};
`

export { StyledAvatar as Avatar, Title, Tagline, Container, Details }
