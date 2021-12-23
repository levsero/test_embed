import LoadingPage from 'classicSrc/components/LoadingPage'
import { Widget, Header, Footer } from 'classicSrc/components/Widget'
import TicketFormList from 'classicSrc/embeds/support/components/TicketFormList'
import { TicketFormsMain } from 'classicSrc/embeds/support/pages/TicketFormsListPage/styles'
import routes from 'classicSrc/embeds/support/routes'
import { getIsAnyTicketFormLoading } from 'classicSrc/embeds/support/selectors'
import {
  getContactFormTitle,
  getFormIdsToDisplay,
  getFormsToDisplay,
} from 'classicSrc/embeds/support/selectors'
import { getLocale } from 'classicSrc/redux/modules/base/base-selectors'
import { getSelectTicketFormLabel } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { HeaderTitle } from './styles'

const mapStateToProps = (state) => ({
  ticketForms: getFormsToDisplay(state),
  selectTicketFormLabel: getSelectTicketFormLabel(state),
  formTitle: getContactFormTitle(state),
  formIds: getFormIdsToDisplay(state),
  locale: getLocale(state),
  isLoading: getIsAnyTicketFormLoading(state),
})

const TicketFormsListPage = ({
  formTitle,
  selectTicketFormLabel,
  ticketForms,
  handleFormOptionClick,
  history,
  isLoading,
}) => {
  const onFormOptionClick = handleFormOptionClick
    ? handleFormOptionClick
    : (formId) => {
        history.push(routes.form(formId))
      }

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <Widget>
      <Header title={formTitle} />
      <TicketFormsMain>
        <HeaderTitle>{selectTicketFormLabel}</HeaderTitle>
        <TicketFormList ticketForms={ticketForms} handleFormOptionClick={onFormOptionClick} />
      </TicketFormsMain>
      <Footer />
    </Widget>
  )
}

TicketFormsListPage.propTypes = {
  selectTicketFormLabel: PropTypes.string.isRequired,
  ticketForms: PropTypes.array.isRequired,
  handleFormOptionClick: PropTypes.func,
  formTitle: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  isLoading: PropTypes.bool.isRequired,
}

const ConnectedComponent = connect(mapStateToProps)(TicketFormsListPage)

export { ConnectedComponent as default, TicketFormsListPage as Component }
