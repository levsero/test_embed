import { TEST_IDS } from 'classicSrc/constants/shared'
import { forwardRef } from 'react'
import { Container } from './styles'

const Main = forwardRef(({ ...props }, ref) => (
  <Container {...props} data-testid={TEST_IDS.WIDGET_MAIN_CONTENT} ref={ref} aria-live={'polite'} />
))

export default Main
