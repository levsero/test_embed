import React from 'react'
import Launcher from 'src/apps/messenger/features/launcher'
import Widget from 'src/apps/messenger/features/widget'
import { useFocusJail } from './hooks/focusJail'

const App = () => {
  const { refLauncher, refWidget, onKeyDownForContainer } = useFocusJail()

  return (
    <div style={{ fontSize: 'initial' }} onKeyDown={onKeyDownForContainer} role="presentation">
      <Launcher ref={refLauncher} />
      <Widget ref={refWidget} />
    </div>
  )
}

export default App
