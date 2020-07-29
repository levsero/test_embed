import React from 'react'
import LauncherFrame from './LauncherFrame'
import { Container } from './styles'

const FocusJailTestComponents = () => <button>ok</button>

const Launcher = React.forwardRef((_props, ref) => {
  return (
    <LauncherFrame>
      <Container
        ref={ref}
        onKeyDown={() => {
          // The focus jail does not pick up onKeyDown if not used at least once.
        }}
        role="presentation"
      >
        Launcher
        <FocusJailTestComponents />
      </Container>
    </LauncherFrame>
  )
})
export default Launcher
