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
  getFormsToDisplay
} from 'embeds/support/selectors'
import { submitTicket } from 'embeds/support/actions'
import { connect } from 'react-redux'
import TicketForm from 'embeds/support/components/TicketForm'
import SupportPropTypes from 'embeds/support/utils/SupportPropTypes'
import { dragStarted } from 'src/embeds/support/actions/index'
import getFields from 'embeds/support/utils/getFields'
import { FileDropProvider } from 'components/FileDropProvider'
import routes from 'embeds/support/routes'
import { Redirect } from 'react-router-dom'

const TicketFormPage = ({
  formTitle,
  formId,
  formState = {},
  readOnlyState = {},
  ticketFields = [],
  submitTicket,
  ticketFormTitle,
  amountOfCustomForms = 0,
  conditions = [],
  attachments = [],
  isPreview,
  formExists
}) => {
  if (formId === routes.defaultFormId && amountOfCustomForms > 0) {
    return <Redirect to={routes.home()} />
  }

  if (formId !== routes.defaultFormId && amountOfCustomForms === 0) {
    return <Redirect to={routes.home()} />
  }

  if (formId !== routes.defaultFormId && !formExists) {
    return <Redirect to={routes.home()} />
  }

  return (
    <FileDropProvider>
      <Widget>
        <Header title={formTitle} useReactRouter={amountOfCustomForms > 1} />

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
  attachments: PropTypes.array,
  conditions: SupportPropTypes.conditions,
  isPreview: PropTypes.bool,
  amountOfCustomForms: PropTypes.number,
  formExists: PropTypes.bool
}

const mapStateToProps = (state, ownProps) => {
  const { params } = ownProps.match
  const id = params.id

  const form = getForm(state, id)

  return {
    formId: id,
    formState: getFormState(state, id),
    formTitle: getContactFormTitle(state),
    ticketFields: getFormTicketFields(state, id),
    readOnlyState: getReadOnlyState(state),
    ticketFormTitle: form ? form.display_name : '',
    amountOfCustomForms: getFormsToDisplay(state).length,
    conditions: form ? form.end_user_conditions : [],
    attachments: getAllAttachments(state),
    formExists: Boolean(id === routes.defaultFormId || form)
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
