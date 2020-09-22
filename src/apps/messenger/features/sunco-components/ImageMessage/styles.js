import styled from 'styled-components'

const getRadius = props => props.theme.messenger.borderRadii.textMessage

const Image = styled.img`
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
`

const PrimaryParticipantImage = styled(Image)`
  ${props => {
    const radius = getRadius(props)
    switch (props.shape) {
      case 'standalone':
        if (props.hasText) return `border-radius: ${radius} ${radius} 0 0;`
        return `border-radius: ${radius};`

      case 'first':
        if (props.hasText) return `border-radius: ${radius} ${radius} 0 0;`
        return `border-radius: ${radius} ${radius} 0;`

      case 'middle':
        if (props.hasText) return `border-radius: ${radius} 0 0 0;`
        return `border-radius: ${radius} 0 0 ${radius};`

      case 'last':
        if (props.hasText) return `border-radius: ${radius} 0 0 0;`
        return `border-radius: ${radius} 0 ${radius} ${radius};`
    }
  }}
`

const OtherParticipantImage = styled(Image)`
  ${props => {
    const radius = getRadius(props)
    switch (props.shape) {
      case 'standalone':
        if (props.hasText) return `border-radius: ${radius} ${radius} 0 0;`
        return `border-radius: ${radius};`

      case 'first':
        if (props.hasText) return `border-radius: ${radius} ${radius} 0 0;`
        return `border-radius: ${radius} ${radius} ${radius} 0;`

      case 'middle':
        if (props.hasText) return `border-radius: 0 ${radius} 0 0;`
        return `border-radius: 0 ${radius} ${radius} 0;`

      case 'last':
        if (props.hasText) return `border-radius: 0 ${radius} 0 0;`
        return `border-radius: 0 ${radius} ${radius} ${radius};`
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
