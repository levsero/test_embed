import React from 'react'
import MessengerFrame from './MessengerFrame'
import { Container } from './styles'

const Messenger = () => {
  return (
    <MessengerFrame>
      <Container>
        <div>Header</div>
        <div style={{ flex: 1 }}>Message log</div>
        <div>Footer</div>
      </Container>
    </MessengerFrame>
  )
}

export default Messenger
