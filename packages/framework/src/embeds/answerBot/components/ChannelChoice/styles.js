import styled from 'styled-components'
import { Icon } from 'component/Icon'
import { zdColorGrey700, zdColorGrey600 } from '@zendeskgarden/css-variables'

const Item = styled.div`
  ${(props) => {
    return `
      display: flex !important;
      align-items: center !important;
      padding: ${12 / props.theme.fontSize}rem ${16 / props.theme.fontSize}rem;

      &:hover {
        svg path {
          stroke: ${zdColorGrey700};
        }
      }
      ${props.single ? singleChannelOnly() : ''}
    `
  }}
`

const singleChannelOnly = () => {
  return `
    justify-content: center;

    svg {
      display: none;
    }
  `
}

const Label = styled.div`
  color: #007fab;
  &:hover {
    text-decoration: underline;
  }
`

const ChannelIcon = styled(Icon)`
  ${(props) => {
    return `
      ${props.theme.rtl ? 'margin-left' : 'margin-right'}: ${10 / props.theme.fontSize}rem;

      svg {
        min-width: ${14 / props.theme.fontSize}rem;
        width: ${14 / props.theme.fontSize}rem;
        height: ${14 / props.theme.fontSize}rem;

        path {
          stroke: ${zdColorGrey600};
          stroke-width: 1.5px;
        }
      }
    `
  }}
`

export { Item, Label, ChannelIcon }
