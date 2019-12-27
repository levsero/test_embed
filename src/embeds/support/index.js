import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import SuccessPage from 'embeds/support/pages/SuccessPage'
import TicketFormPage from 'embeds/support/pages/TicketFormPage'
import TicketFormsListPage from 'embeds/support/pages/TicketFormsListPage'
import { getTicketForms } from 'src/redux/modules/submitTicket/submitTicket-selectors'

const Support = ({ ticketForms }) => {
  const getRouteId = () => (ticketForms.length ? ticketForms[0].id : 'contact-form')
  const indexRoute =
    ticketForms.length > 1 ? '/support/ticketFormsList' : `/support/ticketForm/${getRouteId()}`

  return (
    <Switch>
      <Route path={'/support/ticketForm/:id'} component={TicketFormPage} />
      <Route path={'/support/ticketFormsList'} component={TicketFormsListPage} />
      <Route path={'/support/success'} component={SuccessPage} />
      <Redirect exact={true} from={'/'} to={indexRoute} />
    </Switch>
  )
}

Support.propTypes = {
  ticketForms: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  ticketForms: getTicketForms(state)
})

const connectedComponent = connect(mapStateToProps)(Support)

export { connectedComponent as default, Support as Component }
