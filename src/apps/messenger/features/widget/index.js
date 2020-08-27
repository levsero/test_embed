import React from 'react'
import WidgetFrame from './components/WidgetFrame'
import MessagePage from 'src/apps/messenger/features/widget/components/MessagePage'

const Widget = React.forwardRef((_props, ref) => {
  return (
    <WidgetFrame>
      <MessagePage ref={ref} />
    </WidgetFrame>
  )
})

export default Widget
