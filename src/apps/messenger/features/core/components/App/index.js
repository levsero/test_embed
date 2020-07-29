import React from 'react'
import Launcher from 'src/apps/messenger/features/core/components/Launcher'
import Messenger from 'src/apps/messenger/features/core/components/Messenger'
import { useFocusJail } from './focusJail'

const App = () => {
  const { refLauncher, refWidget, onKeyDownForContainer } = useFocusJail()

  return (
    <div onKeyDown={onKeyDownForContainer} role="presentation">
      <Launcher ref={refLauncher} />
      <Messenger ref={refWidget} />
    </div>
  )
}

export default App
