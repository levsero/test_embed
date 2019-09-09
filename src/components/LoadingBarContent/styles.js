import { Skeleton } from '@zendeskgarden/react-loaders'
import styled from 'styled-components'
import { FONT_SIZE } from 'constants/shared'

export const StyledSkeleton = styled(Skeleton)`
  height: ${10 / FONT_SIZE}rem !important;
  margin-bottom: ${16 / FONT_SIZE}rem;
`
