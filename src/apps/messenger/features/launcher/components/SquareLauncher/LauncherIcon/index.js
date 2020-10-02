import React from 'react'
import PropTypes from 'prop-types'
import AnimatedIcon from 'src/apps/messenger/features/launcher/components/SquareLauncher/LauncherIcon/AnimatedIcon'
import {
  CloseIcon,
  MessengerIcon
} from 'src/apps/messenger/features/launcher/components/SquareLauncher/styles'
import { getPosition } from 'src/apps/messenger/features/themeProvider/store'
import { useSelector } from 'react-redux'

const LauncherIcon = ({ isWidgetOpen }) => {
  const position = useSelector(getPosition)

  return (
    <>
      <AnimatedIcon isVisible={!isWidgetOpen} hiddenPosition="-100%">
        <MessengerIcon
          style={{
            transform: position === 'left' ? 'scaleX(-1)' : undefined
          }}
        />
      </AnimatedIcon>
      <AnimatedIcon isVisible={isWidgetOpen} hiddenPosition="100%">
        <CloseIcon />
      </AnimatedIcon>
    </>
  )
}

LauncherIcon.propTypes = {
  isWidgetOpen: PropTypes.bool
}

export default LauncherIcon
