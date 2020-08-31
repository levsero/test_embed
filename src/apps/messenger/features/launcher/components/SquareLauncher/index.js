import React from 'react'
import { widgetToggled } from 'src/apps/messenger/store/visibility'
import { Avatar, Container } from './styles'
import { useDispatch } from 'react-redux'

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
      <Avatar />
    </Container>
  )
})

export default SquareLauncher
