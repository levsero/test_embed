import React from 'react'
import Composer from 'src/Composer'
import { Container } from './styles'

const MessengerFooter = React.forwardRef((props, ref) => {
  return (
    <Container>
      <Composer ref={ref} {...props} />
    </Container>
  )
})

MessengerFooter.propTypes = Composer.propTypes

export default MessengerFooter
