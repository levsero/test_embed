import styled from 'styled-components'
import { zdColorGrey800, zdColorGrey200 } from '@zendeskgarden/css-variables'

import { isMobileBrowser } from 'utility/devices'
import { FONT_SIZE } from 'constants/shared'
import { Main } from 'components/Widget'

export const HeaderTitle = styled.h2`
  padding-left: ${12 / FONT_SIZE}rem !important;
  padding-right: ${12 / FONT_SIZE}rem !important;
  border-bottom: ${1.1 / FONT_SIZE}rem solid ${zdColorGrey200};
  padding-bottom: ${16 / FONT_SIZE}rem;
  color: ${zdColorGrey800};
  font-size: ${(isMobileBrowser() ? 15 : 14) / FONT_SIZE}rem;
  font-weight: 700;
`

export const TicketFormsMain = styled(Main)`
  &&& {
    margin-left: 0;
    margin-right: 0;
  }
`
