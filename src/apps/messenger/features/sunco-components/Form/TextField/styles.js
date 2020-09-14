import styled from 'styled-components'
import { rgba } from 'polished'
import { Label, Input, Field } from '@zendeskgarden/react-forms'

const StyledField = styled(Field)`
  display: flex;
  flex-direction: column;
`

const StyledLabel = styled(Label)`
  &&& {
    font-size: ${props => props.theme.messenger.fontSizes.md};
  }
`

const StyledInput = styled(Input)`
  margin-bottom: ${props => props.theme.messenger.space.sixteen};

  &&& {
    font-size: ${props => props.theme.messenger.fontSizes.md};
    line-height: ${props => props.theme.messenger.lineHeights.md};
    border-radius: ${props => props.theme.messenger.borderRadii.textMessage};

    :hover {
      border: ${props => props.theme.borders.sm} ${props => props.theme.messenger.colors.action};
      box-shadow: ${props =>
        props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.35))};
    }

    :active {
      border: ${props => props.theme.borders.sm} ${props => props.theme.messenger.colors.action};
      box-shadow: ${props =>
        props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.4))};
    }

    :focus,
    &[data-garden-focus-visible] {
      border: ${props => props.theme.borders.sm} ${props => props.theme.messenger.colors.action};
      box-shadow: ${props =>
        props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.45))};
    }
  }
`

export { StyledInput as Input, StyledLabel as Label, StyledField as Field }
