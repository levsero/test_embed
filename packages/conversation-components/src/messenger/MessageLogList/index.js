import React from 'react'
import PropTypes from 'prop-types'
import { Container, Log } from './styles'

const MessageLogList = React.forwardRef(({ children, onScroll = (_event) => {} }, ref) => {
  return (
    <Container>
      <Log ref={ref} role="log" aria-live="polite" onScroll={onScroll}>
        {children}
      </Log>
    </Container>
  )
})

MessageLogList.propTypes = {
  children: PropTypes.node,
  onScroll: PropTypes.func,
}

export default MessageLogList
