import LoadingPage from 'classicSrc/components/LoadingPage'
import { fetchTicketForms, getTicketFields } from 'classicSrc/embeds/support/actions/fetchForms'
import SuccessPage from 'classicSrc/embeds/support/pages/SuccessPage'
import TicketFormPage from 'classicSrc/embeds/support/pages/TicketFormPage'
import TicketFormsListPage from 'classicSrc/embeds/support/pages/TicketFormsListPage'
import { getTicketForms } from 'classicSrc/embeds/support/selectors'
import { getLocale, getCustomFieldsAvailable } from 'classicSrc/redux/modules/base/base-selectors'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import routes from './routes'

const Support = ({
  ticketForms,
  fetchTicketForms,
  getTicketFields,
  locale,
  customFieldsAvailable,
}) => {
  const [isFetchingForms, setIsFetchingForms] = useState(true)
  const formId = (ticketForms.validatedIds && ticketForms.validatedIds[0]) || routes.defaultFormId
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
    validatedIds: PropTypes.array,
    showList: PropTypes.bool,
    requestAll: PropTypes.bool,
    active: PropTypes.bool,
  }),
  fetchTicketForms: PropTypes.func,
  getTicketFields: PropTypes.func,
  locale: PropTypes.string,
  customFieldsAvailable: PropTypes.bool,
}

const mapStateToProps = (state) => ({
  ticketForms: getTicketForms(state),
  locale: getLocale(state),
  customFieldsAvailable: getCustomFieldsAvailable(state),
})

const connectedComponent = connect(mapStateToProps, { fetchTicketForms, getTicketFields })(Support)

export { connectedComponent as default, Support as Component }
