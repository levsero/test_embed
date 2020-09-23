import React from 'react'
import PropTypes from 'prop-types'
import AnimatedIcon from 'src/apps/messenger/features/launcher/components/SquareLauncher/LauncherIcon/AnimatedIcon'
import {
  CloseIcon,
  MessengerIcon
} from 'src/apps/messenger/features/launcher/components/SquareLauncher/styles'

const LauncherIcon = ({ isWidgetOpen }) => {
  return (
    <>
      <AnimatedIcon isVisible={!isWidgetOpen} hiddenPosition="-100%">
        <MessengerIcon />
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
