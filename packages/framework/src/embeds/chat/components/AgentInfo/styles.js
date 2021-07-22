import styled from 'styled-components'
import { zdColorGrey800, zdColorGrey600 } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'

export const Container = styled.div`
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
  height: ${50 / FONT_SIZE}rem !important;
`

export const TextContainer = styled.div`
  color: ${zdColorGrey800};
  line-height: ${16 / FONT_SIZE}rem;
  padding-left: ${15 / FONT_SIZE}rem;
  overflow: hidden;

  [dir='rtl'] & {
    padding-left: 0 !important;
    padding-right: ${10 / FONT_SIZE}rem !important;
  }
`
const singleLineText = `
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const AgentName = styled.div`
  ${singleLineText}
  font-weight: 700;
`

export const AgentTitle = styled.div`
  ${singleLineText}
  color: ${zdColorGrey600};
`
