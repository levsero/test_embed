import { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Launcher } from '@zendesk/conversation-components'
import { getLauncherShape } from 'src/apps/messenger/features/launcher/store'
import { getPosition } from 'messengerSrc/features/themeProvider/store'
import { getIsWidgetOpen, widgetToggled } from 'messengerSrc/store/visibility'
import LauncherFrame from './components/LauncherFrame'

const LauncherSection = forwardRef((_props, ref) => {
  const dispatch = useDispatch()
  const isWidgetOpen = useSelector(getIsWidgetOpen)
  const position = useSelector(getPosition)
  const launcherShape = useSelector(getLauncherShape)

  return (
    <LauncherFrame>
      <Launcher
        ref={ref}
        isOpen={isWidgetOpen}
        onClick={() => {
          dispatch(widgetToggled())
        }}
        position={position}
        shape={launcherShape}
      />
    </LauncherFrame>
  )
})
export default LauncherSection
