import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import routes from './routes'
import SuccessPage from 'embeds/support/pages/SuccessPage'
import TicketFormPage from 'embeds/support/pages/TicketFormPage'
import TicketFormsListPage from 'embeds/support/pages/TicketFormsListPage'
import { getFormIdsToDisplay, getFormsToDisplay } from 'src/embeds/support/selectors'
import { getLocale, getCustomFieldsAvailable } from 'src/redux/modules/base/base-selectors'
import { fetchTicketForms, getTicketFields } from 'embeds/support/actions/fetchForms'
import LoadingPage from 'components/LoadingPage'

const Support = ({
  ticketForms,
  formIds,
  fetchTicketForms,
  getTicketFields,
  locale,
  customFieldsAvailable
}) => {
  const [isFetchingInitialForms, setIsFetchingInitialForms] = useState(true)
  const formId = ticketForms.length ? ticketForms[0].id : routes.defaultFormId
  const indexRoute = ticketForms.length > 1 ? routes.list() : routes.form(formId)

  useEffect(() => {
    if (formIds.length > 0) {
      fetchTicketForms(formIds, locale).finally(() => {
        setIsFetchingInitialForms(false)
      })
    } else if (customFieldsAvailable) {
      getTicketFields(locale).finally(() => {
        setIsFetchingInitialForms(false)
      })
    } else {
      setIsFetchingInitialForms(false)
    }
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
  getTicketFields: PropTypes.func,
  locale: PropTypes.string,
  customFieldsAvailable: PropTypes.bool
}

const mapStateToProps = state => ({
  ticketForms: getFormsToDisplay(state),
  formIds: getFormIdsToDisplay(state),
  locale: getLocale(state),
  customFieldsAvailable: getCustomFieldsAvailable(state)
})

const connectedComponent = connect(
  mapStateToProps,
  { fetchTicketForms, getTicketFields }
)(Support)

export { connectedComponent as default, Support as Component }
