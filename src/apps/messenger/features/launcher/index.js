import React from 'react'
import LauncherFrame from './components/LauncherFrame'
import SquareLauncher from 'src/apps/messenger/features/launcher/components/SquareLauncher'

const Launcher = React.forwardRef((_props, ref) => {
  return (
    <LauncherFrame>
      <SquareLauncher ref={ref} />
    </LauncherFrame>
  )
})
export default Launcher
