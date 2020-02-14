import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import TicketFormList from 'src/embeds/support/components/TicketFormList'
import { HeaderTitle } from './styles'
import { Widget, Header, Footer } from 'src/components/Widget'
import { getSelectTicketFormLabel } from 'src/redux/modules/selectors'
import { getContactFormTitle, getAllForms } from 'src/embeds/support/selectors'
import { TicketFormsMain } from 'embeds/support/pages/TicketFormsListPage/styles'
import routes from 'embeds/support/routes'

const mapStateToProps = state => ({
  ticketForms: getAllForms(state),
  selectTicketFormLabel: getSelectTicketFormLabel(state),
  formTitle: getContactFormTitle(state)
})

const TicketFormsListPage = ({
  formTitle,
  selectTicketFormLabel,
  ticketForms,
  handleFormOptionClick,
  history
}) => {
  const onFormOptionClick = handleFormOptionClick
    ? handleFormOptionClick
    : formId => {
        history.push(routes.form(formId))
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
    push: PropTypes.func
  })
}

const ConnectedComponent = connect(mapStateToProps)(TicketFormsListPage)

export { ConnectedComponent as default, TicketFormsListPage as Component }
