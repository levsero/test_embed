import React from 'react'
import MessengerFrame from './MessengerFrame'
import { Container } from './styles'

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
      <div
        ref={ref}
        onKeyDown={() => {
          // The focus jail does not pick up onKeyDown if not used at least once.
        }}
        role="presentation"
      >
        <Container>
          <div>Header</div>
          <div style={{ flex: 1 }}>Message log</div>
          <FocusJailTestComponents />
          <div>Footer</div>
        </Container>
      </div>
    </MessengerFrame>
  )
})

export default Messenger
