import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import routes from './routes'
import SuccessPage from 'embeds/support/pages/SuccessPage'
import TicketFormPage from 'embeds/support/pages/TicketFormPage'
import TicketFormsListPage from 'embeds/support/pages/TicketFormsListPage'
import { getTicketForms } from 'src/redux/modules/submitTicket/submitTicket-selectors'
import LoadingPage from 'src/components/LoadingPage'
import { getLoading } from 'src/redux/modules/submitTicket/submitTicket-selectors'

const Support = ({ ticketForms, isLoading }) => {
  const formId = ticketForms.length ? ticketForms[0].id : routes.defaultFormId
  const indexRoute = ticketForms.length > 1 ? routes.list() : routes.form(formId)
  return (
    <Switch>
      {isLoading && <Route component={LoadingPage} />}
      <Route path={routes.form()} component={TicketFormPage} />
      <Route path={routes.list()} component={TicketFormsListPage} />
      <Route path={routes.success()} component={SuccessPage} />
      <Redirect exact={true} from={'/'} to={indexRoute} />
      <Redirect exact={true} from={routes.home()} to={indexRoute} />
    </Switch>
  )
}

Support.propTypes = {
  ticketForms: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  ticketForms: getTicketForms(state),
  isLoading: getLoading(state)
})

const connectedComponent = connect(mapStateToProps)(Support)

export { connectedComponent as default, Support as Component }
