import { useState } from 'react'
import PropTypes from 'prop-types'
import { Form as ReactFinalForm } from 'react-final-form'
import _ from 'lodash'
import Form from './Form'
import { FORM_ERROR } from 'final-form'
import { useSelector } from 'react-redux'
import { getFormValues } from 'src/redux/modules/form/selectors'
import useScrollToFirstError from 'components/DynamicForm/hooks/useScrollToFirstError'
import useSafeState from 'src/hooks/useSafeState'

const DynamicForm = ({
  formId,
  onSubmit,
  getFields,
  isPreview,
  validate,
  footer,
  children,
  controls,
  extraFieldOptions,
  readOnlyValues = {},
  initialValues = {},
}) => {
  const [showErrors, setShowFormErrors] = useState(false)
  const scrollToFirstError = useScrollToFirstError()
  const initialState = useSelector((state) => getFormValues(state, formId))
  const [
    temporaryFieldsToShowWhileSubmitting,
    setTemporaryFieldsToShowWhileSubmitting,
  ] = useSafeState(null)

  // We want screen readers to read out the error message every time the user tries to submit the form.
  // Since in some cases, the error element might already be there, we need a way to get the element to be recreated
  // so that the role="alert" can re-fire and the screen reader reads out the error again,
  // To solve this, we can use React's "key" property to tell React a new element needs to be created
  // whenever the key changes.
  const [errorMessageKey, setErrorMessageKey] = useState(Date.now())

  const onFormSubmit = (values, _form, callback) => {
    setShowFormErrors(true)
    const fields = getFields(values)
    const errors = validate(values)

    if (_.isEmpty(errors)) {
      const valuesToSubmit = {}

      fields.forEach((field) => {
        valuesToSubmit[field.id] = values[field.id]
      })

      setTemporaryFieldsToShowWhileSubmitting(fields)

      Promise.resolve(onSubmit(valuesToSubmit, values))
        .then((result) => {
          if (!result || (result.success === false && !result.errorMessageKey)) {
            throw new Error()
          }

          if (!result.success) {
            const newErrors = {
              [FORM_ERROR]: result.errorMessageKey,
            }
            callback(newErrors)
            scrollToFirstError(getFields(values), newErrors)
            return
          }

          callback()
        })
        .catch(() => {
          const newErrors = {
            [FORM_ERROR]: 'embeddable_framework.submitTicket.notify.message.error',
          }
          callback(newErrors)
          scrollToFirstError(getFields(values), newErrors)
        })
        .finally(() => {
          setTemporaryFieldsToShowWhileSubmitting(null)
        })
    } else {
      callback(errors)

      scrollToFirstError(getFields(values), errors)
      setErrorMessageKey(Date.now())
    }
  }

  return (
    <ReactFinalForm
      validate={(values) => {
        if (!showErrors) {
          return null
        }

        return validate(values)
      }}
      onSubmit={onFormSubmit}
      initialValues={{ ...initialValues, ...initialState }}
      render={({ handleSubmit, submitting, submitError, errors, values }) => (
        <Form
          extraFieldOptions={extraFieldOptions}
          isSubmitting={submitting}
          isPreview={isPreview}
          controls={controls}
          onSubmit={(e) => {
            e.preventDefault()
            if (isPreview) {
              return
            }

            // Since final form won't re-submit when errors exist, we will handle scrolling to the errors here
            // so that the form will re-scroll to the first error every time the user tries to submit
            // the form.
            if (errors) {
              setErrorMessageKey(Date.now())
              scrollToFirstError(getFields(values), errors)
            }

            handleSubmit()
          }}
          formId={formId}
          showErrors={showErrors}
          fields={temporaryFieldsToShowWhileSubmitting ?? getFields(values)}
          submitErrorMessage={submitError}
          errorMessageKey={errorMessageKey}
          readOnlyValues={readOnlyValues}
          footer={footer}
        >
          {children}
        </Form>
      )}
    />
  )
}

DynamicForm.propTypes = {
  formId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSubmit: PropTypes.func.isRequired,
  getFields: PropTypes.func,
  isPreview: PropTypes.bool,
  validate: PropTypes.func,
  footer: PropTypes.func,
  extraFieldOptions: PropTypes.objectOf(PropTypes.elementType),
  readOnlyValues: PropTypes.objectOf(PropTypes.bool),
  initialValues: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.node,
  controls: PropTypes.node,
}

export default DynamicForm
