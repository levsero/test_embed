import React from 'react'
import Composer, { ComposerPropTypes } from 'src/Composer'
import { Container } from './styles'

const Footer = React.forwardRef((props, ref) => {
  return (
    <Container>
      <Composer ref={ref} {...props} />
    </Container>
  )
})

Footer.propTypes = {
  ...ComposerPropTypes
}

export default Footer
