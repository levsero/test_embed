import React from 'react'
import { useSelector } from 'react-redux'
import Launcher from 'src/apps/messenger/features/launcher'
import Messenger from 'src/apps/messenger/features/messenger'
import { getIsMessengerOpen } from 'src/apps/messenger/store/messengerVisibility'

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
