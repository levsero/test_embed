import styled from 'styled-components'
import { zdColorGrey600, zdColorGrey800 } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'

export const FileName = styled.div`
  font-size: ${14 / FONT_SIZE}rem;
  color: ${zdColorGrey800};
`
export const FileSize = styled.div`
  font-size: ${14 / FONT_SIZE}rem;
  color: ${zdColorGrey600};
`

export const ErrorBody = styled.div`
  font-size: ${props => 14 / props.theme.fontSize}rem;
`
