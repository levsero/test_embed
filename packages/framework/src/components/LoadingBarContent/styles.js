import styled from 'styled-components'
import { Skeleton } from '@zendeskgarden/react-loaders'
import { FONT_SIZE } from 'constants/shared'

export const StyledSkeleton = styled(Skeleton)`
  height: ${12 / FONT_SIZE}rem !important;
  margin-bottom: ${16 / FONT_SIZE}rem;
`
