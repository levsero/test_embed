import { rgba } from 'polished'
import styled from 'styled-components'
import { IconButton } from '@zendeskgarden/react-buttons'

const Input = styled.input`
  display: none;
`

const FileInputButton = styled(IconButton)`
  &&& {
    :hover {
      border: ${(props) => props.theme.borders.sm} ${(props) => props.theme.palette.grey[500]};
    }

    :focus,
    :active,
    &[data-garden-focus-visible] {
      border: ${(props) => props.theme.borders.sm} ${(props) => props.theme.messenger.colors.action};
      box-shadow: ${(props) =>
        props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.35))};
    }
  }
`

export { Input, FileInputButton }
