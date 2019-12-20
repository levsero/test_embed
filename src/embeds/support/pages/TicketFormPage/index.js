import React from 'react'
import PropTypes from 'prop-types'
import { Widget, Header } from 'components/Widget'
import { getCustomTicketFields, getFormState } from 'embeds/support/selectors'
import { getContactFormTitle } from 'src/redux/modules/selectors'
import { connect } from 'react-redux'
import TicketForm from 'embeds/support/components/TicketForm'
import * as selectors from 'src/redux/modules/submitTicket/submitTicket-selectors'

const TicketFormPage = ({ formTitle, formName, formState, readOnlyState, ticketFields }) => {
  return (
    <Widget>
      <Header title={formTitle} />

      <TicketForm
        formName={formName}
        formState={formState}
        readOnlyState={readOnlyState}
        submitForm={() => {}}
        ticketFields={ticketFields}
      />
    </Widget>
  )
}

TicketFormPage.propTypes = {
  formTitle: PropTypes.string,
  formName: PropTypes.string,
  formState: PropTypes.shape({}),
  readOnlyState: PropTypes.objectOf(PropTypes.bool),
  ticketFields: PropTypes.array
}

const mapStateToProps = state => {
  const formName = 'contactForm'

  return {
    formName,
    formState: getFormState(state, formName),
    formTitle: getContactFormTitle(state),
    ticketFields: getCustomTicketFields(state),
    readOnlyState: selectors.getReadOnlyState(state)
  }
}

const connectedComponent = connect(mapStateToProps)(TicketFormPage)

export { connectedComponent as default, TicketFormPage as Component }
