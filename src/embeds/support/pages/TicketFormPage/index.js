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
      <Header title={formTitle} useReactRouter={true} />

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
  formName: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  formState: PropTypes.shape({}),
  readOnlyState: PropTypes.objectOf(PropTypes.bool),
  ticketFields: PropTypes.array,
  submitTicket: PropTypes.func
}

const mapStateToProps = (state, ownProps) => {
  const { params } = ownProps.match
  const id = params.id

  return {
    formName: id,
    formState: getFormState(state, id),
    formTitle: getContactFormTitle(state),
    ticketFields: getFormTicketFields(state, id),
    readOnlyState: getReadOnlyState(state)
  }
}

const connectedComponent = connect(
  mapStateToProps,
  { submitTicket }
)(TicketFormPage)

export { connectedComponent as default, TicketFormPage as Component }
