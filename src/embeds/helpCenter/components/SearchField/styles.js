import styled from 'styled-components'
import { Dots } from '@zendeskgarden/react-loaders'
import SearchIcon from '@zendeskgarden/svg-icons/src/16/search-stroke.svg'
import ClearInputIcon from '@zendeskgarden/svg-icons/src/16/x-stroke.svg'
import { zdColorGrey600, zdColorGrey400, zdColorGrey800 } from '@zendeskgarden/css-variables'

const ClearInputButton = styled(ClearInputIcon)`
  color: ${zdColorGrey600} !important;
  &:hover {
    color: ${zdColorGrey800} !important;
  }
  height: 1.2rem !important;
  width: 1.2rem !important;
`

const StyledSearchIcon = styled(SearchIcon)`
  color: ${zdColorGrey400} !important;
  height: 1.2rem !important;
  width: 1.2rem !important;
`

const LoadingDots = styled(Dots)`
  color: ${props => props.theme.baseColor} !important;
  font-size: 1.2rem !important;
`

const Container = styled.div`
  > div > div {
    max-height: unset;
  }
`

export { LoadingDots, StyledSearchIcon as SearchIcon, ClearInputButton, Container }
