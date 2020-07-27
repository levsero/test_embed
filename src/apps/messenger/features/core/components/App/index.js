import React from 'react'
import PropTypes from 'prop-types'
import Launcher from 'src/apps/messenger/features/core/components/Launcher'
import Messenger from 'src/apps/messenger/features/core/components/Messenger'
import { getIsWidgetOpen } from 'src/apps/messenger/features/core/store'
import { connect } from 'react-redux'

import { useFocusJail } from './focusJail'

const App = ({ showMessenger }) => {
  const { refLauncher, refWidget, onKeyDownForContainer } = useFocusJail(showMessenger)

  return (
    <div onKeyDown={onKeyDownForContainer} role="presentation">
      <Launcher ref={refLauncher} />
      {showMessenger && <Messenger ref={refWidget} />}
    </div>
  )
}

App.propTypes = {
  showMessenger: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
  return {
    showMessenger: getIsWidgetOpen(state)
  }
}

const connectedComponent = connect(mapStateToProps)(App)
export { connectedComponent as default, App as Component }
