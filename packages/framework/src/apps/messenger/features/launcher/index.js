import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SquareLauncher } from '@zendesk/conversation-components'
import { getIsWidgetOpen, widgetToggled } from 'src/apps/messenger/store/visibility'
import { getPosition } from 'src/apps/messenger/features/themeProvider/store'
import LauncherFrame from './components/LauncherFrame'

const Launcher = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch()
  const isWidgetOpen = useSelector(getIsWidgetOpen)
  const position = useSelector(getPosition)

  return (
    <LauncherFrame>
      <SquareLauncher
        ref={ref}
        isOpen={isWidgetOpen}
        onClick={() => {
          dispatch(widgetToggled())
        }}
        position={position}
      />
    </LauncherFrame>
  )
})
export default Launcher
