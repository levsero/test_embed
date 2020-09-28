import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { widgetToggled, getIsWidgetOpen } from 'src/apps/messenger/store/visibility'

import { Container, Button } from './styles'
import LauncherIcon from 'src/apps/messenger/features/launcher/components/SquareLauncher/LauncherIcon'

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
        <LauncherIcon isWidgetOpen={isWidgetOpen} />
      </Button>
    </Container>
  )
})

export default SquareLauncher
