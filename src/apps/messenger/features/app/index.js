import React from 'react'
import { useSelector } from 'react-redux'
import Launcher from 'src/apps/messenger/features/launcher'
import Widget from 'src/apps/messenger/features/widget'
import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
import { useFocusJail } from './hooks/focusJail'

const App = () => {
  const showWidget = useSelector(getIsWidgetOpen)
  const { refLauncher, refWidget, onKeyDownForContainer } = useFocusJail(showWidget)

  return (
    <div onKeyDown={onKeyDownForContainer} role="presentation">
      <Launcher ref={refLauncher} />
      {showWidget && <Widget ref={refWidget} />}
    </div>
  )
}

export default App
