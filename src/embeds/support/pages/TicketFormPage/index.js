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
import { FileDropProvider } from 'components/FileDropProvider'

const TicketFormPage = ({
  formTitle,
  formId,
  formState = {},
  readOnlyState = {},
  ticketFields = [],
  submitTicket,
  ticketFormTitle,
  ticketForms = [],
  conditions = [],
  attachments = [],
  isPreview
}) => {
  return (
    <FileDropProvider>
      <Widget>
        <Header title={formTitle} useReactRouter={ticketForms.length > 1} />

        <TicketForm
          formId={formId}
          formState={formState}
          readOnlyState={readOnlyState}
          ticketFormTitle={ticketFormTitle}
          submitForm={formState =>
            submitTicket(formState, formId, getFields(formState, conditions, ticketFields))
          }
          isPreview={isPreview}
          ticketFields={ticketFields}
          conditions={conditions}
          attachments={attachments}
        />
      </Widget>
    </FileDropProvider>
  )
}

TicketFormPage.propTypes = {
  formTitle: PropTypes.string,
  formId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  formState: PropTypes.shape({}),
  readOnlyState: PropTypes.objectOf(PropTypes.bool),
  ticketFields: PropTypes.array,
  submitTicket: PropTypes.func,
  ticketFormTitle: PropTypes.string,
  ticketForms: PropTypes.array,
  attachments: PropTypes.array,
  conditions: SupportPropTypes.conditions,
  isPreview: PropTypes.bool
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
