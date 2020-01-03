import styled from 'styled-components'

import { FONT_SIZE } from 'constants/shared'
import {
  zdColorGrey100,
  zdColorGrey300,
  zdColorGrey400,
  zdColorGrey600,
  zdColorGrey800,
  zdColorWhite
} from '@zendeskgarden/css-variables'
import PAPERCLIP_SMALL from '@zendeskgarden/svg-icons/src/14/attachment.svg'

export const Container = styled.div`
  cursor: pointer !important;
  border-width: ${2 / FONT_SIZE}rem;
  border-color: ${zdColorGrey300};
  border-style: dashed;
  border-radius: ${5 / FONT_SIZE}rem;
  background-color: ${zdColorWhite};
  opacity: 0.9;

  &:hover {
    background-color: ${zdColorGrey400};
  }

  padding: ${14 / FONT_SIZE}rem ${10 / FONT_SIZE}rem;
  color: ${zdColorGrey800};

  &:hover {
    background-color: ${zdColorGrey100} !important;
  }
`

export const Description = styled.div`
  text-align: center !important;
`

export const Label = styled.div`
  display: inline-block !important;
  max-width: 100%;
  vertical-align: top !important;
  color: ${zdColorGrey600};
`

export const Icon = styled(PAPERCLIP_SMALL)`
  max-width: 100%;
  margin-right: ${5 / FONT_SIZE}rem;
  margin-top: ${2 / FONT_SIZE}rem;
  ${props => {
    return props.theme.rtl
      ? {
          marginright: '0'
        }
      : { marginleft: `${5 / FONT_SIZE}rem` }
  }}

  color: ${props => props.theme.baseColor};

  transform-origin: center;
  transform: rotate(45deg);
  svg {
    min-width: ${16 / FONT_SIZE}rem; /* 1 */
    min-height: ${16 / FONT_SIZE}rem; /* 1 */
    height: ${16 / FONT_SIZE}rem;
    width: ${16 / FONT_SIZE}rem;
    transform-origin: center;
    transform: rotate(45deg);
  }
`
