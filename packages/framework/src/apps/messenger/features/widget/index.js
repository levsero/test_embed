import { forwardRef } from 'react'
import { Route, Switch } from 'react-router-dom'
import MessagePage from 'src/apps/messenger/features/widget/components/MessagePage'
import ChannelPage from './components/ChannelPage'
import WidgetFrame from './components/WidgetFrame'

const Widget = forwardRef((_props, ref) => {
  return (
    <WidgetFrame>
      <Switch>
        <Route path="/channelPage/:channelId">
          <ChannelPage ref={ref} />
        </Route>
        <Route path="/">
          <MessagePage ref={ref} />
        </Route>
      </Switch>
    </WidgetFrame>
  )
})

export default Widget
