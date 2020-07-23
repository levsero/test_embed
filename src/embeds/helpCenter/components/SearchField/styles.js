import styled from 'styled-components'
import SearchIcon from '@zendeskgarden/svg-icons/src/16/search-stroke.svg'
import { zdColorGrey400 } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'constants/shared'

const StyledSearchIcon = styled(SearchIcon)`
  color: ${zdColorGrey400} !important;
  height: ${() => 19.2 / FONT_SIZE}rem !important;
  width: ${() => 19.2 / FONT_SIZE}rem !important;
`

const Container = styled.div`
  margin-top: ${props => 4 / props.theme.fontSize}rem;
  > div > div > div {
    max-height: unset;
  }
`

export { StyledSearchIcon as SearchIcon, Container }
