import { forwardRef } from 'react'
import MessagePage from 'src/apps/messenger/features/widget/components/MessagePage'
import WidgetFrame from './components/WidgetFrame'

const Widget = forwardRef((_props, ref) => {
  return (
    <WidgetFrame>
      <MessagePage ref={ref} />
    </WidgetFrame>
  )
})

export default Widget
