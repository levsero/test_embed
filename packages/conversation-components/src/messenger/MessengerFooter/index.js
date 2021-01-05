import React from 'react'
import PropTypes from 'prop-types'
import Composer from 'src/Composer'
import { Container } from './styles'

const MessengerFooter = React.forwardRef((props, ref) => {
  return (
    <Container>
      <Composer ref={ref} {...props} />
    </Container>
  )
})

MessengerFooter.propTypes = {
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  inputAriaLabel: PropTypes.string,
  sendButtonAriaLabel: PropTypes.string,
  sendButtonTooltip: PropTypes.string,
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
  onSendMessage: PropTypes.func
}

export default MessengerFooter
