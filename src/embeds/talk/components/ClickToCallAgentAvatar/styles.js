import styled from 'styled-components'
import AgentAvatar from 'src/embeds/talk/icons/widget-icon_avatar.svg'

const Avatar = styled(AgentAvatar)`
  ${props => {
    const fontSize = props.theme.fontSize
    return `
      height: ${70 / fontSize}rem;
      width: ${70 / fontSize}rem;
      margin-bottom: ${10 / fontSize}rem;
    `
  }}
`

export { Avatar }
