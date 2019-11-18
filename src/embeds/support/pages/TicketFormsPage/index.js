import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import TicketFormList from 'src/embeds/support/components/TicketFormList'
import { HeaderTitle } from './styles'
import { Widget, Header, Footer } from 'src/components/Widget'
import * as selectors from 'src/redux/modules/submitTicket/submitTicket-selectors'
import { getContactFormTitle } from 'src/redux/modules/selectors'
import { getSelectTicketFormLabel } from 'src/redux/modules/selectors'
import { TicketFormsMain } from 'embeds/support/pages/TicketFormsPage/styles'

const mapStateToProps = state => ({
  ticketForms: selectors.getTicketForms(state),
  selectTicketFormLabel: getSelectTicketFormLabel(state),
  formTitle: getContactFormTitle(state)
})

const TicketFormsPage = ({
  formTitle,
  selectTicketFormLabel,
  ticketForms,
  handleFormOptionClick
}) => {
  return (
    <Widget>
      <Header title={formTitle} />
      <TicketFormsMain>
        <HeaderTitle>{selectTicketFormLabel}</HeaderTitle>
        <TicketFormList ticketForms={ticketForms} handleFormOptionClick={handleFormOptionClick} />
      </TicketFormsMain>
      <Footer />
    </Widget>
  )
}

TicketFormsPage.propTypes = {
  selectTicketFormLabel: PropTypes.string.isRequired,
  ticketForms: PropTypes.array.isRequired,
  handleFormOptionClick: PropTypes.func.isRequired,
  formTitle: PropTypes.string.isRequired
}

const ConnectedComponent = connect(mapStateToProps)(TicketFormsPage)

export { ConnectedComponent as default, TicketFormsPage as Component }
