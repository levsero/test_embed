import React from 'react'
import Header from 'src/apps/messenger/features/header'
import { Container } from './styles'
import { useSelector } from 'react-redux'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'

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

const MessagePage = React.forwardRef((_props, ref) => {
  const isFullScreen = useSelector(getIsFullScreen)

  return (
    <Container
      isFullScreen={isFullScreen}
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
  )
})

export default MessagePage
