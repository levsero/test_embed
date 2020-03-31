import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import routes from './routes'
import SuccessPage from 'embeds/support/pages/SuccessPage'
import TicketFormPage from 'embeds/support/pages/TicketFormPage'
import TicketFormsListPage from 'embeds/support/pages/TicketFormsListPage'
import { getFormIdsToDisplay, getFormsToDisplay, getIsLoading } from 'src/embeds/support/selectors'
import LoadingPage from 'src/components/LoadingPage'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { fetchTicketForms } from 'embeds/support/actions/fetchForms'

const Support = ({ ticketForms, isLoading, formIds, fetchTicketForms, locale }) => {
  const formId = ticketForms.length ? ticketForms[0].id : routes.defaultFormId
  const indexRoute = ticketForms.length > 1 ? routes.list() : routes.form(formId)

  useEffect(() => {
    fetchTicketForms(formIds, locale)
  }, [fetchTicketForms, formIds, locale])

  return (
    <Switch>
      {isLoading && <Route component={LoadingPage} />}
      <Route path={routes.form()} component={TicketFormPage} />
      {ticketForms.length > 1 && <Route path={routes.list()} component={TicketFormsListPage} />}
      <Route path={routes.success()} component={SuccessPage} />
      <Redirect to={indexRoute} />
    </Switch>
  )
}

Support.propTypes = {
  ticketForms: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  formIds: PropTypes.arrayOf(PropTypes.number),
  fetchTicketForms: PropTypes.func,
  locale: PropTypes.string
}

const mapStateToProps = state => ({
  ticketForms: getFormsToDisplay(state),
  isLoading: getIsLoading(state),
  formIds: getFormIdsToDisplay(state),
  locale: getLocale(state)
})

const connectedComponent = connect(
  mapStateToProps,
  { fetchTicketForms }
)(Support)

export { connectedComponent as default, Support as Component }
