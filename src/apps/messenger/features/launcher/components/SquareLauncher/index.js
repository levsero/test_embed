import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { widgetToggled, getIsWidgetOpen } from 'src/apps/messenger/store/visibility'

import { Container, MessengerIcon, CloseIcon, Button } from './styles'

const SquareLauncher = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch()
  const isWidgetOpen = useSelector(getIsWidgetOpen)

  return (
    <Container
      ref={ref}
      onKeyDown={() => {
        // The focus jail does not pick up onKeyDown if not used at least once.
      }}
    >
      <Button
        onClick={() => {
          dispatch(widgetToggled())
        }}
        aria-label="Zendesk Messenger Launcher"
        isPill={false}
      >
        {isWidgetOpen ? <CloseIcon /> : <MessengerIcon />}
      </Button>
    </Container>
  )
})

export default SquareLauncher
