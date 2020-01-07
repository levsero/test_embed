import React from 'react'
import PropTypes from 'prop-types'
import { Widget, Header } from 'components/Widget'
import {
  getFormTicketFields,
  getFormState,
  getReadOnlyState,
  getTicketFormTitle
} from 'embeds/support/selectors'
import { getTicketForms } from 'src/redux/modules/submitTicket/submitTicket-selectors'
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
  submitTicket,
  match,
  ticketFormTitle,
  ticketForms
}) => {
  return (
    <Widget>
      <Header title={formTitle} useReactRouter={ticketForms.length > 1} />

      <TicketForm
        formName={formName}
        formState={formState}
        readOnlyState={readOnlyState}
        ticketFormTitle={ticketFormTitle}
        submitForm={formState => submitTicket(formState, match.params.id)}
        ticketFields={ticketFields}
      />
    </Widget>
  )
}

TicketFormPage.propTypes = {
  formTitle: PropTypes.string,
  formName: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  formState: PropTypes.shape({}),
  readOnlyState: PropTypes.objectOf(PropTypes.bool),
  ticketFields: PropTypes.array,
  submitTicket: PropTypes.func,
  match: PropTypes.object,
  ticketFormTitle: PropTypes.string,
  ticketForms: PropTypes.array.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { params } = ownProps.match
  const id = params.id

  return {
    formName: id,
    formState: getFormState(state, id),
    formTitle: getContactFormTitle(state),
    ticketFields: getFormTicketFields(state, id),
    ticketFormTitle: getTicketFormTitle(state, id),
    readOnlyState: getReadOnlyState(state),
    ticketForms: getTicketForms(state)
  }
}

const connectedComponent = connect(
  mapStateToProps,
  { submitTicket }
)(TicketFormPage)

export { connectedComponent as default, TicketFormPage as Component }
