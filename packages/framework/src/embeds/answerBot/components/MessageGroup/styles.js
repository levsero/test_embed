import styled from 'styled-components'
import { Avatar as AvatarComponent } from 'src/component/Avatar'
import { zdColorGrey600 } from '@zendeskgarden/css-variables'

const Container = styled.div`
  ${props => {
    return `
      position: relative !important;
      margin-bottom: ${5 / props.theme.fontSize}rem !important;
    `
  }}
`

const animate = () => `
  animation: fadeIn 200ms 1 ease-in-out;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const Name = styled.div`
  ${props => {
    return `
      margin-top: ${5 / props.theme.fontSize}rem !important;
      margin-bottom: ${5 / props.theme.fontSize}rem !important;
      color: ${zdColorGrey600} !important;

      ${props.theme.rtl ? `margin-right: ${40 / props.theme.fontSize}rem;` : ''}
      ${!props.theme.rtl ? `margin-left: ${50 / props.theme.fontSize}rem;` : ''}
      ${props.shouldAnimate ? animate() : ''}
    `
  }}
`

const avatarStyle = props => {
  return `
    position: absolute !important;
    transition: top 300ms ease-in-out;
    padding-bottom: ${7 / props.theme.fontSize}rem;
    height: ${32 / props.theme.fontSize}rem;
    width: ${32 / props.theme.fontSize}rem;
    background-color: transparent !important;

    svg {
      border-radius: 50%;
      min-width: ${32 / props.theme.fontSize}rem;
      min-height: ${32 / props.theme.fontSize}rem;
      width: ${32 / props.theme.fontSize}rem;
      height: ${32 / props.theme.fontSize}rem;
    }
    ${props.shouldAnimate ? animate() : ''}
  `
}

const Avatar = styled(AvatarComponent)`
  ${props => avatarStyle(props)}
`

const IconContainer = styled.div`
  ${props => avatarStyle(props)}
`

export { Container, Name, Avatar, IconContainer }
