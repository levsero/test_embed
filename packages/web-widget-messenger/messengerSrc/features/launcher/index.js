import { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SquareLauncher } from '@zendesk/conversation-components'
import { getPosition } from 'messengerSrc/features/themeProvider/store'
import { getIsWidgetOpen, widgetToggled } from 'messengerSrc/store/visibility'
import LauncherFrame from './components/LauncherFrame'

const Launcher = forwardRef((_props, ref) => {
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
