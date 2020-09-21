import styled from 'styled-components'

const radius = props => props.theme.messenger.borderRadii.textMessage

const Image = styled.img`
  width: ${props => props.theme.messenger.space.textMaxWidth};
  max-width: ${props => props.theme.messenger.space.textMaxWidth};

  ${props => {
    if (props.isPrimaryParticipant) {
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
    } else {
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
    }
  }}
`

const Text = styled.span`
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: ${props => props.theme.messenger.space.textMaxWidth};
  font-size: ${props => props.theme.messenger.fontSizes.md};
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  width: auto;
`

const Padding = styled.div`
  padding-left: ${props => props.theme.messenger.space.sm};
  padding-right: ${props => props.theme.messenger.space.sm};
  padding-top: ${props => props.theme.messenger.space.xs};
  padding-bottom: ${props => props.theme.messenger.space.xs};
  width: 100%;
`

export { Image, Text, Padding }
