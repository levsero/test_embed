import styled from 'styled-components'

const getRadius = props => props.theme.messenger.borderRadii.textMessage

const Bubble = styled.div`
  width: fit-content;
  margin-top: ${props => props.theme.messenger.space.xxxs};
  max-width: ${props => props.theme.messenger.space.messageMaxWidth};
`

const PrimaryParticipantBubble = styled(Bubble)`
  background-color: ${props => props.theme.messenger.colors.message};
  color: ${props => props.theme.messenger.colors.messageText};

  ${props => {
    const radius = getRadius(props)
    switch (props.shape) {
      case 'standalone':
        return `border-radius: ${radius};`
      case 'first':
        return `border-radius: ${radius} ${radius} 0;`
      case 'middle':
        return `border-radius: ${radius} 0 0 ${radius};`
      case 'last':
        return `border-radius: ${radius} 0 ${radius} ${radius};`
    }
  }}
`

const OtherParticipantBubble = styled(Bubble)`
  border-color: ${props => props.theme.messenger.colors.otherParticipantMessageBorder};
  background-color: ${props => props.theme.messenger.colors.otherParticipantMessage};
  color: ${props => props.theme.messenger.colors.otherParticipantMessageText};

  ${props => {
    const radius = getRadius(props)
    switch (props.shape) {
      case 'standalone':
        return `border-radius: ${radius};`
      case 'first':
        return `border-radius: ${radius} ${radius} ${radius} 0;`
      case 'middle':
        return `border-radius: 0 ${radius} ${radius} 0;`
      case 'last':
        return `border-radius: 0 ${radius} ${radius} ${radius};`
    }
  }}
`

export { PrimaryParticipantBubble, OtherParticipantBubble }
