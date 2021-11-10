import Launcher from 'messengerSrc/features/launcher'
import LauncherLabel from 'messengerSrc/features/launcherLabel'
import LauncherUnreadIndicator from 'messengerSrc/features/launcherUnreadIndicator'
import Widget from 'messengerSrc/features/widget'
import { getAreCookiesEnabled } from 'messengerSrc/store/cookies'
import { useSelector } from 'react-redux'
import { useFocusJail } from './hooks/focusJail'

const App = () => {
  const { refLauncher, refWidget, refLauncherLabel, onKeyDownForContainer } = useFocusJail()
  const cookiesEnabled = useSelector(getAreCookiesEnabled)

  if (!cookiesEnabled) {
    return null
  }

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
