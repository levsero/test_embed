import styled from 'styled-components'

const radius = props => props.theme.messenger.borderRadii.textMessage

const Bubble = styled.div`
  border-radius: ${radius};
  border-color: ${props => props.theme.messenger.colors.messageBorder};
  width: fit-content;
  margin-top: ${props => props.theme.messenger.space.xxxs};
  max-width: ${props => props.theme.messenger.space.messageMaxWidth};
`

const PrimaryParticipantBubble = styled(Bubble)`
background-color: ${props => props.theme.messenger.colors.message};
color: ${props => props.theme.messenger.colors.messageText};
align-self: flex-end;

${props => props.first && `border-radius: ${radius(props)} ${radius(props)} 0;`}

${props => props.middle && `border-radius: ${radius(props)} 0 0 ${radius(props)};`}

${props => props.last && `border-radius: ${radius(props)} 0 ${radius(props)} ${radius(props)};`}
`

const OtherParticipantBubble = styled(Bubble)`
background-color: ${props => props.theme.messenger.colors.primaryMessage};
color: ${props => props.theme.messenger.colors.primaryMessageText};

${props => props.first && `border-radius: ${radius(props)} ${radius(props)} ${radius(props)} 0;`}

${props => props.middle && `border-radius: 0 ${radius(props)} ${radius(props)} 0;`}

${props => props.last && `border-radius: 0 ${radius(props)} ${radius(props)} ${radius(props)};`}
`

export { PrimaryParticipantBubble, OtherParticipantBubble }
