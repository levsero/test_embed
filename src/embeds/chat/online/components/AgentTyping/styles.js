import styled from 'styled-components'
import { Inline } from '@zendeskgarden/react-loaders'
import { zdColorGrey500, zdColorGrey600 } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'constants/shared'
import { isMobileBrowser } from 'utility/devices'

const LoadingDots = styled(Inline)`
  color: ${zdColorGrey500} !important;
  vertical-align: middle;
  height: 1.4rem !important;
  width: 1.4rem !important;
  padding-bottom: ${2 / FONT_SIZE}rem;

  ${props =>
    props.theme.rtl ? `margin-left: ${5 / FONT_SIZE}rem;` : `margin-right: ${5 / FONT_SIZE}rem;`}
`

const Container = styled.div`
  height: ${26 / FONT_SIZE}rem;
  width: 100%;
  margin-top: ${() => (isMobileBrowser() ? 0 : `${12 / FONT_SIZE}rem`)};
  margin-bottom: ${() => (isMobileBrowser() ? 0 : `${1 / FONT_SIZE}rem`)};
  color: ${zdColorGrey600};
`

export { LoadingDots, Container }