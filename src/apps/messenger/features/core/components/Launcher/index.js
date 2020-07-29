import React from 'react'
import { useDispatch } from 'react-redux'
import LauncherFrame from './LauncherFrame'
import { Container } from './styles'
import { widgetToggle } from 'src/apps/messenger/features/core/store'

const FocusJailTestComponents = () => <button>ok</button>

const Launcher = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch()
  return (
    <LauncherFrame>
      <Container
        ref={ref}
        onKeyDown={() => {
          // The focus jail does not pick up onKeyDown if not used at least once.
        }}
        role="button"
        onClick={() => {
          dispatch(widgetToggle())
        }}
      >
        Launcher
        <FocusJailTestComponents />
      </Container>
    </LauncherFrame>
  )
})
export default Launcher
