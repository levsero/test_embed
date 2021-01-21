import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { widgetToggled, getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
import LauncherIcon from 'src/apps/messenger/features/launcher/components/SquareLauncher/LauncherIcon'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'

import { Container, Button } from './styles'

const SquareLauncher = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch()
  const isWidgetOpen = useSelector(getIsWidgetOpen)
  const translate = useTranslate()

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
        aria-label={translate('embeddable_framework.messenger.launcher.button')}
        isPill={false}
      >
        <>
          <LauncherIcon isWidgetOpen={isWidgetOpen} />
        </>
      </Button>
    </Container>
  )
})

export default SquareLauncher
