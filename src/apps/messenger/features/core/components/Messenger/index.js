import React from 'react'
import MessengerFrame from './MessengerFrame'
import { Container } from './styles'
import Header from 'src/apps/messenger/features/header'

const FocusJailTestComponents = () => {
  return (
    <div>
      <label htmlFor="name">Name (4 to 8 characters):</label>

      <input
        type="text"
        id="name"
        name="name"
        required={true}
        minLength="4"
        maxLength="8"
        size="10"
      />

      <button>ok</button>
    </div>
  )
}

const Messenger = React.forwardRef((_props, ref) => {
  return (
    <MessengerFrame>
      <Container
        ref={ref}
        onKeyDown={() => {
          // The focus jail does not pick up onKeyDown if not used at least once.
        }}
        role="presentation"
      >
        <Header />
        <div>
          <div>Message log</div>
          <FocusJailTestComponents />
        </div>
        <div>Footer</div>
      </Container>
    </MessengerFrame>
  )
})

export default Messenger
