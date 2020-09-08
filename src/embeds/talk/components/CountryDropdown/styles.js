import styled from 'styled-components'
import { Item, Menu, Select } from '@zendeskgarden/react-dropdowns'
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

const StyledSelect = styled(Select)`
  min-width: ${65 / FONT_SIZE}rem !important;
  max-width: none;
`

export { StyledItem as Item, StyledMenu as Menu, StyledSelect as Select }
