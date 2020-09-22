import styled from 'styled-components'

const radius = props => props.theme.messenger.borderRadii.textMessage

const Bubble = styled.div`
  width: fit-content;
  margin-top: ${props => props.theme.messenger.space.xxxs};
  max-width: ${props => props.theme.messenger.space.messageMaxWidth};
`

const PrimaryParticipantBubble = styled(Bubble)`
  background-color: ${props => props.theme.messenger.colors.message};
  color: ${props => props.theme.messenger.colors.messageText};

  ${props => {
    switch (props.shape) {
      case 'standalone':
        return `border-radius: ${radius(props)};`
      case 'first':
        return `border-radius: ${radius(props)} ${radius(props)} 0;`
      case 'middle':
        return `border-radius: ${radius(props)} 0 0 ${radius(props)};`
      case 'last':
        return `border-radius: ${radius(props)} 0 ${radius(props)} ${radius(props)};`
    }
  }}
`

const OtherParticipantBubble = styled(Bubble)`
  border-color: ${props => props.theme.messenger.colors.otherParticipantMessageBorder};
  background-color: ${props => props.theme.messenger.colors.otherParticipantMessage};
  color: ${props => props.theme.messenger.colors.otherParticipantMessageText};

  ${props => {
    switch (props.shape) {
      case 'standalone':
        return `border-radius: ${radius(props)};`
      case 'first':
        return `border-radius: ${radius(props)} ${radius(props)} ${radius(props)} 0;`
      case 'middle':
        return `border-radius: 0 ${radius(props)} ${radius(props)} 0;`
      case 'last':
        return `border-radius: 0 ${radius(props)} ${radius(props)} ${radius(props)};`
    }
  }}
`

export { PrimaryParticipantBubble, OtherParticipantBubble }
