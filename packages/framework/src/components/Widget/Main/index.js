import { forwardRef } from 'react'
import { TEST_IDS } from 'constants/shared'
import { Container } from './styles'

const Main = forwardRef(({ ...props }, ref) => (
  <Container {...props} data-testid={TEST_IDS.WIDGET_MAIN_CONTENT} ref={ref} />
))

export default Main
