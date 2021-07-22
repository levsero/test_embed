import styled from 'styled-components'
import { zdColorGrey200 } from '@zendeskgarden/css-variables'
import { KeyboardFocusButton } from 'src/component/shared/KeyboardFocusButton'

const Button = styled(KeyboardFocusButton)`
  border: none;
  background: none;
  width: 100%;
  text-align: inherit;
`

const OptionsList = styled.ul`
  &&& {
    display: block;
  }
`

const ListItem = styled.li`
  color: ${(props) => props.theme.listColorStr};
  line-height: ${(props) => 16 / props.theme.fontSize}rem;
  padding: ${(props) => 8 / props.theme.fontSize}rem ${(props) => 12 / props.theme.fontSize}rem;
  transition: background-color 250ms ease-out;
  border: ${(props) => 1 / props.theme.fontSize}rem ${zdColorGrey200} solid;
  border-top: none;
  max-width: ${(props) => 219 / props.theme.fontSize}rem;

  &:hover {
    background-color: ${zdColorGrey200};
    cursor: pointer;
    transition: background-color 250ms ease-in;
    color: ${(props) => props.theme.listHighlightColorStr};
  }

  &:last-child {
    border-bottom-left-radius: ${(props) => 16 / props.theme.fontSize}rem;
    border-bottom-right-radius: ${(props) => 16 / props.theme.fontSize}rem;
  }
`

export { OptionsList, ListItem, Button }
