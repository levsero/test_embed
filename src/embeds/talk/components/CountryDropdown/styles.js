import styled from 'styled-components'
import { Item, Menu } from '@zendeskgarden/react-dropdowns'
import { FONT_SIZE } from 'constants/shared'

const StyledMenu = styled(Menu)`
  min-width: ${props => props.width}px;
  max-width: ${props => props.width}px;
  max-height: ${215 / FONT_SIZE}rem;
  overflow: auto;
`

const StyledItem = styled(Item)`
  display: flex !important;
`

export { StyledItem as Item, StyledMenu as Menu }
