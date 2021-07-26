import styled from 'styled-components'
import {
  zdColorGrey100,
  zdColorGrey300,
  zdColorGrey400,
  zdColorGrey600,
  zdColorGrey800,
  zdColorWhite,
} from '@zendeskgarden/css-variables'
import Paperclip from '@zendeskgarden/svg-icons/src/16/paperclip.svg'
import { FONT_SIZE } from 'src/constants/shared'

export const AttachmentButton = styled.button.attrs(() => ({
  type: 'button',
}))`
  cursor: pointer !important;
  border-width: ${2 / FONT_SIZE}rem;
  border-color: ${zdColorGrey300};
  border-style: dashed;
  border-radius: ${5 / FONT_SIZE}rem;
  background-color: ${zdColorWhite};
  opacity: 0.9;
  display: block;
  width: 100%;

  &:hover {
    background-color: ${zdColorGrey400};
  }

  padding: ${14 / FONT_SIZE}rem ${10 / FONT_SIZE}rem;
  color: ${zdColorGrey800};

  &:hover {
    background-color: ${zdColorGrey100} !important;
  }

  input {
    display: none;
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

export const Icon = styled(Paperclip)`
  max-width: 100%;

  ${(props) =>
    props.theme.rtl ? `margin-left: ${5 / FONT_SIZE}rem;` : `margin-right: ${5 / FONT_SIZE}rem;`}

  color: ${(props) => props.theme.baseColor};
  min-width: ${18 / FONT_SIZE}rem;
  min-height: ${18 / FONT_SIZE}rem;
  height: ${18 / FONT_SIZE}rem;
  width: ${18 / FONT_SIZE}rem;
`
