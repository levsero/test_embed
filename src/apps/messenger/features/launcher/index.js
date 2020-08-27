import React from 'react'
import LauncherFrame from './components/LauncherFrame'
import SquareLauncher from 'src/apps/messenger/features/launcher/components/SquareLauncher'
import { useSelector } from 'react-redux'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'

const Launcher = React.forwardRef((_props, ref) => {
  const isVisible = useSelector(getIsLauncherVisible)

  if (!isVisible) {
    return null
  }

  return (
    <LauncherFrame>
      <SquareLauncher ref={ref} />
    </LauncherFrame>
  )
})
export default Launcher
