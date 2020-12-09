import styled from 'styled-components'

import { Inline } from '@zendeskgarden/react-loaders'

const DotLoader = styled(Inline)`
  width: ${props => props.theme.messenger.iconSizes.xl};
  height: ${props => props.theme.messenger.iconSizes.lg};
  margin-top: ${props => props.theme.messenger.space.xxxs};
  margin-left: ${props => props.theme.messenger.space.sm};
  margin-right: ${props => props.theme.messenger.space.sm};
`

export { DotLoader }
