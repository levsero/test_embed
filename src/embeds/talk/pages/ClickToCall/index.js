import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ClickToCallPage from './ClickToCallPage'
import ClickToCallInProgressPage from './ClickToCallInProgressPage'

import { getSnapcallCallStatus } from 'src/embeds/talk/selectors'

const ClickToCall = ({ callStatus }) => {
  const ActivePage = callStatus === 'active' ? ClickToCallInProgressPage : ClickToCallPage

  return (
    <Switch>
      <Route component={ActivePage} />
      <Redirect exact={true} from="/" to={ClickToCallPage} />
    </Switch>
  )
}

ClickToCall.propTypes = {
  callStatus: PropTypes.string
}

const mapStateToProps = state => ({
  callStatus: getSnapcallCallStatus(state)
})

const connectedComponent = connect(mapStateToProps)(ClickToCall)

export { connectedComponent as default, ClickToCall as Component }
