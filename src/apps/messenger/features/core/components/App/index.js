import React from 'react'
import Launcher from 'src/apps/messenger/features/core/components/Launcher'
import Messenger from 'src/apps/messenger/features/core/components/Messenger'
import { getIsMessengerOpen } from 'src/apps/messenger/features/core/store'
import { useSelector } from 'react-redux'

import { useFocusJail } from './focusJail'

const App = () => {
  const showMessenger = useSelector(getIsMessengerOpen)
  const { refLauncher, refWidget, onKeyDownForContainer } = useFocusJail(showMessenger)

  return (
    <div onKeyDown={onKeyDownForContainer} role="presentation">
      <Launcher ref={refLauncher} />
      {showMessenger && <Messenger ref={refWidget} />}
    </div>
  )
}

export default App
