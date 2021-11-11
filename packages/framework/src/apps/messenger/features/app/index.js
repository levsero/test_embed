import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { getLauncherShape } from 'src/apps/messenger/features/launcher/store'
import Widget from 'src/apps/messenger/features/widget'
import { getAreCookiesEnabled } from 'src/apps/messenger/store/cookies'
import { useFocusJail } from './hooks/focusJail'

const Launcher = React.lazy(() => import('src/apps/messenger/features/launcher'))
const LauncherLabel = React.lazy(() => import('src/apps/messenger/features/launcherLabel'))
const LauncherUnreadIndicator = React.lazy(() =>
  import('src/apps/messenger/features/launcherUnreadIndicator')
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
      {launcherShape !== 'none' && (
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
