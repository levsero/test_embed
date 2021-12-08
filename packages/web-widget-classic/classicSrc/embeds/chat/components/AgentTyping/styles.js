import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'
import { zdColorGrey500, zdColorGrey600 } from '@zendeskgarden/css-variables'
import { Inline } from '@zendeskgarden/react-loaders'
import { isMobileBrowser } from '@zendesk/widget-shared-services'

const LoadingDots = styled(Inline)`
  color: ${zdColorGrey500} !important;
  vertical-align: middle;
  height: 1.4rem !important;
  width: 1.4rem !important;
  padding-bottom: ${2 / FONT_SIZE}rem;

  ${(props) =>
    props.theme.rtl ? `margin-left: ${5 / FONT_SIZE}rem;` : `margin-right: ${5 / FONT_SIZE}rem;`}
`

const Container = styled.div`
  width: 100%;
  padding-top: ${() => (isMobileBrowser() ? 0 : `${12 / FONT_SIZE}rem`)};
  padding-bottom: ${() => (isMobileBrowser() ? `${4 / FONT_SIZE}rem` : `${6 / FONT_SIZE}rem`)};
  color: ${zdColorGrey600};
`

export { LoadingDots, Container }
