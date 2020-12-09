import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'src/framework/components/Frame'
import ThemeProvider from 'src/apps/messenger/features/themeProvider'
import FrameAnimation from 'src/apps/messenger/features/widget/components/WidgetFrame/FrameAnimation'

const MessengerFrame = ({ children }) => {
  return (
    <FrameAnimation>
      {(state, styles) => (
        <Frame title="Messenger" hidden={state === 'exited'} style={styles}>
          <ThemeProvider>{children}</ThemeProvider>
        </Frame>
      )}
    </FrameAnimation>
  )
}
MessengerFrame.propTypes = {
  children: PropTypes.node
}

export default MessengerFrame
