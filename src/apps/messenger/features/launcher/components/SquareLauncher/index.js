import React from 'react'
import { widgetToggled } from 'src/apps/messenger/store/visibility'
import { Container } from './styles'
import { useDispatch } from 'react-redux'

const FocusJailTestComponents = () => <button>ok</button>

const SquareLauncher = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch()

  return (
    <Container
      ref={ref}
      onKeyDown={() => {
        // The focus jail does not pick up onKeyDown if not used at least once.
      }}
      role="button"
      onClick={() => {
        dispatch(widgetToggled())
      }}
    >
      Launcher
      <FocusJailTestComponents />
    </Container>
  )
})

export default SquareLauncher
