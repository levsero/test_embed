import styled from 'styled-components'

const radius = props => props.theme.messenger.borderRadii.textMessage

const Image = styled.img`
  width: ${props => props.theme.messenger.space.textMaxWidth};
  max-width: ${props => props.theme.messenger.space.textMaxWidth};
`

const PrimaryParticipantImage = styled(Image)`
  ${props => {
    switch (props.shape) {
      case 'standalone':
        if (props.hasText) return `border-radius: ${radius(props)} ${radius(props)} 0 0;`
        return `border-radius: ${radius(props)};`

      case 'first':
        if (props.hasText) return `border-radius: ${radius(props)} ${radius(props)} 0 0;`
        return `border-radius: ${radius(props)} ${radius(props)} 0;`

      case 'middle':
        if (props.hasText) return `border-radius: ${radius(props)} 0 0 0;`
        return `border-radius: ${radius(props)} 0 0 ${radius(props)};`

      case 'last':
        if (props.hasText) return `border-radius: ${radius(props)} 0 0 0;`
        return `border-radius: ${radius(props)} 0 ${radius(props)} ${radius(props)};`
    }
  }}
`

const OtherParticipantImage = styled(Image)`
  ${props => {
    switch (props.shape) {
      case 'standalone':
        if (props.hasText) return `border-radius: ${radius(props)} ${radius(props)} 0 0;`
        return `border-radius: ${radius(props)};`

      case 'first':
        if (props.hasText) return `border-radius: ${radius(props)} ${radius(props)} 0 0;`
        return `border-radius: ${radius(props)} ${radius(props)} ${radius(props)} 0;`

      case 'middle':
        if (props.hasText) return `border-radius: 0 ${radius(props)} 0 0;`
        return `border-radius: 0 ${radius(props)} ${radius(props)} 0;`

      case 'last':
        if (props.hasText) return `border-radius: 0 ${radius(props)} 0 0;`
        return `border-radius: 0 ${radius(props)} ${radius(props)} ${radius(props)};`
    }
  }}
`

const Text = styled.p`
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: ${props => props.theme.messenger.space.textMaxWidth};
  font-size: ${props => props.theme.messenger.fontSizes.md};
  line-height: ${props => props.theme.messenger.lineHeights.sm};

  padding: ${props => `${props.theme.messenger.space.xs} ${props.theme.messenger.space.sm}`};
`

export { PrimaryParticipantImage, OtherParticipantImage, Text }
