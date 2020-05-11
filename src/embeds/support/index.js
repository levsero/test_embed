import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import useDeepCompareEffect from 'use-deep-compare-effect'
import routes from './routes'
import SuccessPage from 'embeds/support/pages/SuccessPage'
import TicketFormPage from 'embeds/support/pages/TicketFormPage'
import TicketFormsListPage from 'embeds/support/pages/TicketFormsListPage'
import { getFormIdsToDisplay, getFormsToDisplay } from 'src/embeds/support/selectors'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { fetchTicketForms } from 'embeds/support/actions/fetchForms'
import LoadingPage from 'components/LoadingPage'

const Support = ({ ticketForms, formIds, fetchTicketForms, locale }) => {
  const [isFetchingInitialForms, setIsFetchingInitialForms] = useState(true)
  const formId = ticketForms.length ? ticketForms[0].id : routes.defaultFormId
  const indexRoute = ticketForms.length > 1 ? routes.list() : routes.form(formId)

  useDeepCompareEffect(() => {
    fetchTicketForms(formIds, locale).finally(() => {
      setIsFetchingInitialForms(false)
    })
  }, [fetchTicketForms, formIds, locale])

  if (isFetchingInitialForms) {
    return <LoadingPage />
  }

  return (
    <Switch>
      <Route path={routes.form()} component={TicketFormPage} />
      {ticketForms.length > 1 && <Route path={routes.list()} component={TicketFormsListPage} />}
      <Route path={routes.success()} component={SuccessPage} />

      <Redirect to={indexRoute} />
    </Switch>
  )
}

Support.propTypes = {
  ticketForms: PropTypes.array.isRequired,
  formIds: PropTypes.arrayOf(PropTypes.number),
  fetchTicketForms: PropTypes.func,
  locale: PropTypes.string
}

const mapStateToProps = state => ({
  ticketForms: getFormsToDisplay(state),
  formIds: getFormIdsToDisplay(state),
  locale: getLocale(state)
})

const connectedComponent = connect(
  mapStateToProps,
  { fetchTicketForms }
)(Support)

export { connectedComponent as default, Support as Component }
