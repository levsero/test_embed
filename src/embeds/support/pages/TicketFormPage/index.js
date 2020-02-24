import React from 'react'
import PropTypes from 'prop-types'
import { Widget, Header } from 'components/Widget'
import {
  getFormTicketFields,
  getFormState,
  getReadOnlyState,
  getForm,
  getAllAttachments,
  getContactFormTitle,
  getAllForms
} from 'embeds/support/selectors'
import { submitTicket } from 'embeds/support/actions'
import { connect } from 'react-redux'
import TicketForm from 'embeds/support/components/TicketForm'
import SupportPropTypes from 'embeds/support/utils/SupportPropTypes'
import { dragStarted } from 'src/embeds/support/actions/index'
import getFields from 'embeds/support/utils/getFields'

const TicketFormPage = ({
  formTitle,
  formName,
  formState,
  readOnlyState,
  ticketFields,
  submitTicket,
  match,
  ticketFormTitle,
  ticketForms,
  conditions,
  dragStarted,
  attachments
}) => {
  return (
    <div onDragEnter={dragStarted}>
      <Widget>
        <Header title={formTitle} useReactRouter={ticketForms.length > 1} />

        <TicketForm
          formName={formName}
          formState={formState}
          readOnlyState={readOnlyState}
          ticketFormTitle={ticketFormTitle}
          submitForm={formState =>
            submitTicket(formState, match.params.id, getFields(formState, conditions, ticketFields))
          }
          ticketFields={ticketFields}
          conditions={conditions}
          attachments={attachments}
        />
      </Widget>
    </div>
  )
}

TicketFormPage.propTypes = {
  formTitle: PropTypes.string,
  formName: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  formState: PropTypes.shape({}),
  readOnlyState: PropTypes.objectOf(PropTypes.bool),
  ticketFields: PropTypes.array,
  submitTicket: PropTypes.func,
  dragStarted: PropTypes.func.isRequired,
  match: PropTypes.object,
  ticketFormTitle: PropTypes.string,
  ticketForms: PropTypes.array.isRequired,
  attachments: PropTypes.array,
  conditions: SupportPropTypes.conditions
}

const mapStateToProps = (state, ownProps) => {
  const { params } = ownProps.match
  const id = params.id

  const form = getForm(state, id)

  return {
    formName: id,
    formState: getFormState(state, id),
    formTitle: getContactFormTitle(state),
    ticketFields: getFormTicketFields(state, id),
    readOnlyState: getReadOnlyState(state),
    ticketFormTitle: form ? form.display_name : '',
    ticketForms: getAllForms(state),
    conditions: form ? form.end_user_conditions : [],
    attachments: getAllAttachments(state)
  }
}

const actionCreators = {
  dragStarted,
  submitTicket
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators
)(TicketFormPage)

export { connectedComponent as default, TicketFormPage as Component }
