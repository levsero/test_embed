import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import routes from './routes'
import SuccessPage from 'embeds/support/pages/SuccessPage'
import TicketFormPage from 'embeds/support/pages/TicketFormPage'
import TicketFormsListPage from 'embeds/support/pages/TicketFormsListPage'
import { getTicketForms } from 'src/embeds/support/selectors'
import { getLocale, getCustomFieldsAvailable } from 'src/redux/modules/base/base-selectors'
import { fetchTicketForms, getTicketFields } from 'embeds/support/actions/fetchForms'
import LoadingPage from 'components/LoadingPage'

const Support = ({
  ticketForms,
  fetchTicketForms,
  getTicketFields,
  locale,
  customFieldsAvailable
}) => {
  const [isFetchingForms, setIsFetchingForms] = useState(true)
  const formId = (ticketForms.ids && ticketForms.ids[0]) || routes.defaultFormId
  const indexRoute = ticketForms.showList ? routes.list() : routes.form(formId)

  useEffect(() => {
    if (ticketForms.active) {
      fetchTicketForms(ticketForms, locale).finally(() => {
        setIsFetchingForms(false)
      })
    } else if (customFieldsAvailable) {
      getTicketFields(locale).finally(() => {
        setIsFetchingForms(false)
      })
    } else {
      setIsFetchingForms(false)
    }
  }, [fetchTicketForms, ticketForms, locale])

  if (isFetchingForms) {
    return <LoadingPage />
  }

  return (
    <Switch>
      <Route path={routes.form()} component={TicketFormPage} />
      {ticketForms.showList && <Route path={routes.list()} component={TicketFormsListPage} />}
      <Route path={routes.success()} component={SuccessPage} />

      <Redirect to={indexRoute} />
    </Switch>
  )
}

Support.propTypes = {
  ticketForms: PropTypes.shape({
    ids: PropTypes.array,
    showList: PropTypes.bool,
    requestAll: PropTypes.bool,
    active: PropTypes.bool,
    allFetched: PropTypes.bool
  }),
  fetchTicketForms: PropTypes.func,
  getTicketFields: PropTypes.func,
  locale: PropTypes.string,
  customFieldsAvailable: PropTypes.bool
}

const mapStateToProps = state => ({
  ticketForms: getTicketForms(state),
  locale: getLocale(state),
  customFieldsAvailable: getCustomFieldsAvailable(state)
})

const connectedComponent = connect(
  mapStateToProps,
  { fetchTicketForms, getTicketFields }
)(Support)

export { connectedComponent as default, Support as Component }
