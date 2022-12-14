import DynamicForm from 'classicSrc/components/DynamicForm'
import SubmitButton from 'classicSrc/components/DynamicForm/SubmitButton'
import { Footer } from 'classicSrc/components/Widget'
import { formOpened, submitTicket } from 'classicSrc/embeds/support/actions'
import TicketFormControls from 'classicSrc/embeds/support/components/TicketForm/TicketFormControls'
import { TicketFormTitle } from 'classicSrc/embeds/support/components/TicketForm/styles'
import routes from 'classicSrc/embeds/support/routes'
import {
  getTicketFormTitle,
  getAllAttachments,
  getCanDisplayForm,
  getForm,
  getFormState,
  getFormsToDisplay,
  getFormTicketFields,
  getCustomerProvidedDefaultValues,
  getIsAnyTicketFormLoading,
  getIsFormLoading,
  getReadOnlyState,
} from 'classicSrc/embeds/support/selectors'
import SupportPropTypes from 'classicSrc/embeds/support/utils/SupportPropTypes'
import getFields from 'classicSrc/embeds/support/utils/getFields'
import validateTicketForm from 'classicSrc/embeds/support/utils/validateTicketForm'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { connect } from 'react-redux'

const TicketForm = ({
  formId,
  readOnlyState = {},
  ticketFields = [],
  submitTicket,
  ticketFormTitle,
  conditions = [],
  attachments = [],
  isPreview,
  initialValues,
  formOpened,
}) => {
  const translate = useTranslate()

  useEffect(() => {
    formOpened(formId)
  }, [formId, formOpened])

  return (
    <DynamicForm
      formId={`support-${formId}`}
      onSubmit={async (values) => {
        try {
          const fields = getFields(values, conditions, ticketFields)
          const valuesWithOriginalIds = {}

          fields.forEach((field) => {
            if (values[field.id]) {
              valuesWithOriginalIds[field.originalId ?? field.id] = values[field.id]
            }
          })

          await submitTicket(valuesWithOriginalIds, formId, fields)
          return {
            success: true,
          }
        } catch {
          return {
            success: false,
            errorMessageKey: 'embeddable_framework.submitTicket.notify.message.error',
          }
        }
      }}
      getFields={(values) => getFields(values, conditions, ticketFields)}
      initialValues={initialValues}
      isPreview={isPreview}
      validate={(values) => validateTicketForm(ticketFields, values, attachments, conditions)}
      controls={<TicketFormControls formId={formId} fields={ticketFields} />}
      readOnlyValues={readOnlyState}
      footer={({ isSubmitting }) => (
        <Footer>
          <SubmitButton
            submitting={isSubmitting}
            label={translate('embeddable_framework.submitTicket.form.submitButton.label.send')}
          />
        </Footer>
      )}
      children={null}
    >
      {ticketFormTitle && <TicketFormTitle>{ticketFormTitle}</TicketFormTitle>}
    </DynamicForm>
  )
}

TicketForm.propTypes = {
  formId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnlyState: SupportPropTypes.readOnlyState.isRequired,
  submitTicket: PropTypes.func.isRequired,
  ticketFields: PropTypes.arrayOf(SupportPropTypes.ticketField).isRequired,
  ticketFormTitle: PropTypes.string,
  conditions: SupportPropTypes.conditions,
  attachments: PropTypes.array,
  isPreview: PropTypes.bool,
  initialValues: PropTypes.objectOf(PropTypes.any),
  formOpened: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.formId

  const form = getForm(state, id)

  return {
    formId: id,
    formState: getFormState(state, id),
    ticketFields: getFormTicketFields(state, id),
    readOnlyState: getReadOnlyState(state),
    ticketFormTitle: getTicketFormTitle(state, id),
    amountOfCustomForms: getFormsToDisplay(state).length,
    conditions: form ? form.end_user_conditions : [],
    attachments: getAllAttachments(state),
    formExists: Boolean(id === routes.defaultFormId || getCanDisplayForm(state, id)),
    isLoading: getIsFormLoading(state, id),
    isAnyTicketFormLoading: getIsAnyTicketFormLoading(state),
    initialValues: getCustomerProvidedDefaultValues(state, id),
  }
}

const mapDispatchToProps = {
  formOpened,
  submitTicket,
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketForm)

export { TicketForm as Component }
