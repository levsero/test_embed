import React from 'react'

import { useFocusJail } from './hooks/focusJail'
import Launcher from 'src/apps/messenger/features/launcher'
import Widget from 'src/apps/messenger/features/widget'
import LauncherLabel from 'src/apps/messenger/features/launcherLabel'
import LauncherUnreadIndicator from 'src/apps/messenger/features/launcherUnreadIndicator'

const App = () => {
  const { refLauncher, refWidget, refLauncherLabel, onKeyDownForContainer } = useFocusJail()

  return (
    <div style={{ fontSize: 'initial' }} onKeyDown={onKeyDownForContainer} role="presentation">
      <Widget ref={refWidget} />

      <LauncherLabel ref={refLauncherLabel} />

      <Launcher ref={refLauncher} />

      <LauncherUnreadIndicator />
    </div>
  )
}

export default App
