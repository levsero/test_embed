import { useDispatch, useSelector } from 'react-redux'
import {
  formUpdated,
  getFormInfo,
  nextClicked
} from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/slice'
import { useCallback, useEffect, useRef, useState } from 'react'
import validate from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/validate'
import { submitForm } from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/actions'

const useForm = ({ formId, fields }) => {
  const { values: valuesFromState, status, step } = useSelector(state => getFormInfo(state, formId))

  const [values, setValues] = useState(valuesFromState)
  const [errors, setErrors] = useState({})
  const [lastSubmittedStep, setLastSubmittedStep] = useState(0)
  const [lastSubmittedTimestamp, setLastSubmittedTimestamp] = useState(Date.now())
  const dispatch = useDispatch()
  const visibleFields = fields.slice(0, step)

  // Store as a ref so the useEffect can access the last value on unmount
  const currentValues = useRef(values)
  currentValues.current = values
  useEffect(() => {
    return () => {
      dispatch(formUpdated({ formId, values: currentValues.current }))
    }
  }, [dispatch, currentValues])

  // Validate when values change or after a step has been submitted
  useEffect(() => {
    setErrors(validate(fields.slice(0, lastSubmittedStep), values))
  }, [values, lastSubmittedStep])

  const onChange = useCallback(
    (updatedValues = {}) => {
      setValues(previousValues => ({ ...previousValues, ...updatedValues }))
    },
    [setValues]
  )

  const onStep = () => {
    setLastSubmittedStep(step)

    const formErrors = validate(visibleFields, values)

    if (Object.keys(formErrors).length === 0) {
      dispatch(nextClicked({ formId }))
    } else {
      setErrors(formErrors)
    }

    setLastSubmittedTimestamp(Date.now())
  }

  const onSubmit = () => {
    setLastSubmittedStep(step)

    const formErrors = validate(fields, values)
    setErrors(formErrors)
    setLastSubmittedTimestamp(Date.now())

    if (Object.keys(formErrors).length !== 0) {
      return
    }

    dispatch(
      submitForm({
        formId,
        fields,
        values
      })
    )
  }

  return {
    values,
    errors,
    fields: visibleFields,
    onChange,
    step,
    status,
    onStep,
    onSubmit,
    lastSubmittedTimestamp
  }
}

export default useForm
