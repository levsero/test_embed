import React from 'react'
import Frame from 'src/framework/components/Frame'

const Messenger = () => {
  return (
    <Frame
      title="TODO: Messenger"
      style={{
        height: 700,
        width: 380,
        maxHeight: 'calc(100vh - 90px - 10px)',
        position: 'fixed',
        bottom: 90,
        right: 0,
        border: '1px solid black'
      }}
    >
      Messenger
    </Frame>
  )
}

export default Messenger
