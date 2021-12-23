import styled from 'styled-components'
import { zdColorGrey400 } from '@zendeskgarden/css-variables'
import SearchIcon from '@zendeskgarden/svg-icons/src/16/search-stroke.svg'

const StyledSearchIcon = styled(SearchIcon)`
  color: ${zdColorGrey400} !important;
`

export { StyledSearchIcon as SearchIcon }
