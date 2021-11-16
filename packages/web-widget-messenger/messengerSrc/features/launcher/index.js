import { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Launcher } from '@zendesk/conversation-components'
import { getPosition } from 'messengerSrc/features/themeProvider/store'
import { getIsWidgetOpen, widgetToggled } from 'messengerSrc/store/visibility'
import LauncherFrame from './components/LauncherFrame'

const LauncherSection = forwardRef((_props, ref) => {
  const dispatch = useDispatch()
  const isWidgetOpen = useSelector(getIsWidgetOpen)
  const position = useSelector(getPosition)

  return (
    <LauncherFrame>
      <Launcher
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
export default LauncherSection
