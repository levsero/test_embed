import React from 'react'
import { useSelector } from 'react-redux'

import Header from 'src/apps/messenger/features/header'
import Footer from 'src/apps/messenger/features/footer'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'

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
      <div
        style={{
          display: 'flex',
          flexGrow: '1',
          flexDirection: 'column',
          backgroundColor: 'white'
        }}
      >
        <div>Message log</div>
        <FocusJailTestComponents />
      </div>
      <Footer />
    </Container>
  )
})

export default MessagePage
