import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'src/framework/components/Frame'
import ThemeProvider from 'src/apps/messenger/features/core/components/ThemeProvider'

const MessengerFrame = ({ children }) => {
  return (
    <Frame
      title="TODO: Messenger"
      style={{
        height: 700,
        width: 380,
        maxHeight: 'calc(100vh - 90px - 10px)',
        position: 'fixed',
        bottom: 90,
        right: 0
      }}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </Frame>
  )
}

MessengerFrame.propTypes = {
  children: PropTypes.node
}

export default MessengerFrame
