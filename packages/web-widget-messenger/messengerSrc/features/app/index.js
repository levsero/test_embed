import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { LAUNCHER_SHAPES } from '@zendesk/conversation-components'
import { getLauncherShape } from 'messengerSrc/features/launcher/store'
import Widget from 'messengerSrc/features/widget'
import { getAreCookiesEnabled } from 'messengerSrc/store/cookies'
import { useFocusJail } from './hooks/focusJail'

const Launcher = React.lazy(() => import('messengerSrc/features/launcher'))
const LauncherLabel = React.lazy(() => import('messengerSrc/features/launcherLabel'))
const LauncherUnreadIndicator = React.lazy(() =>
  import('messengerSrc/features/launcherUnreadIndicator')
)
const App = () => {
  const { refLauncher, refWidget, refLauncherLabel, onKeyDownForContainer } = useFocusJail()
  const cookiesEnabled = useSelector(getAreCookiesEnabled)
  const launcherShape = useSelector(getLauncherShape)

  if (!cookiesEnabled) {
    return null
  }

  return (
    <div style={{ fontSize: 'initial' }} onKeyDown={onKeyDownForContainer} role="presentation">
      <Widget ref={refWidget} />
      {launcherShape !== LAUNCHER_SHAPES.none && (
        <Suspense fallback={null}>
          <LauncherLabel ref={refLauncherLabel} />

          <Launcher ref={refLauncher} />

          <LauncherUnreadIndicator />
        </Suspense>
      )}
    </div>
  )
}

export default App
