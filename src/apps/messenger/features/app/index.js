import React from 'react'
import Launcher from 'src/apps/messenger/features/launcher'
import Widget from 'src/apps/messenger/features/widget'
import { useFocusJail } from './hooks/focusJail'
import LauncherLabel from 'src/apps/messenger/features/launcherLabel'

const App = () => {
  const { refLauncher, refWidget, refLauncherLabel, onKeyDownForContainer } = useFocusJail()

  return (
    <div style={{ fontSize: 'initial' }} onKeyDown={onKeyDownForContainer} role="presentation">
      <Widget ref={refWidget} />

      <LauncherLabel ref={refLauncherLabel} />

      <Launcher ref={refLauncher} />
    </div>
  )
}

export default App
