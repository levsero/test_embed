import styled from 'styled-components'
import { Button as GardenButton } from '@zendeskgarden/react-buttons'
import ClockIcon from '@zendeskgarden/svg-icons/src/16/clock-stroke.svg'
import { zdColorGrey300, zdColorGrey600, zdColorGrey800 } from '@zendeskgarden/css-variables'

const Container = styled.div`
  border-bottom: ${zdColorGrey300} ${(props) => 1 / props.theme.fontSize}rem solid;
  text-align: center;
  padding-bottom: ${(props) => 10 / props.theme.fontSize}rem;
  margin-bottom: ${(props) => 10 / props.theme.fontSize}rem;
`

const Button = styled(GardenButton).attrs(() => ({
  isLink: true,
  ignoreThemeOverride: true,
}))`
  &&& {
    &,
    &:hover {
      color: ${zdColorGrey800} !important;
    }
  }
`

const HistoryIcon = styled(ClockIcon)`
  &&& {
    margin-right: ${(props) => 6 / props.theme.fontSize}rem;
    vertical-align: middle;

    color: ${zdColorGrey600};

    ${(props) =>
      props.theme.rtl &&
      `
      margin-right: 0;
      margin-left: ${6 / props.theme.fontSize}rem;
    `}
  }
`

export { Container, Button, HistoryIcon }
