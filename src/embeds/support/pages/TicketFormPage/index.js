import React from 'react'
import PropTypes from 'prop-types'
import { Widget, Header } from 'components/Widget'
import { getFormTicketFields, getFormState, getReadOnlyState } from 'embeds/support/selectors'
import { getContactFormTitle } from 'src/redux/modules/selectors'
import { submitTicket } from 'embeds/support/actions'
import { connect } from 'react-redux'
import TicketForm from 'embeds/support/components/TicketForm'

const TicketFormPage = ({
  formTitle,
  formName,
  formState,
  readOnlyState,
  ticketFields,
  submitTicket
}) => {
  return (
    <Widget>
      <Header title={formTitle} />

      <TicketForm
        formName={formName}
        formState={formState}
        readOnlyState={readOnlyState}
        submitForm={formState => submitTicket(formState, 'contact-form')}
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
  ticketFields: PropTypes.array,
  submitTicket: PropTypes.func
}

const mapStateToProps = state => {
  const formName = 'contactForm'

  return {
    formName,
    formState: getFormState(state, formName),
    formTitle: getContactFormTitle(state),
    ticketFields: getFormTicketFields(state),
    readOnlyState: getReadOnlyState(state)
  }
}

const connectedComponent = connect(
  mapStateToProps,
  { submitTicket }
)(TicketFormPage)

export { connectedComponent as default, TicketFormPage as Component }
