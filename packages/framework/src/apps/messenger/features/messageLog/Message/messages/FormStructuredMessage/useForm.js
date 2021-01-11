import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formUpdated, getFormInfo, stepChanged, submitForm } from './store'

const useForm = ({ formId, fields }) => {
  const { values: valuesFromState, formSubmissionStatus, step } = useSelector(state =>
    getFormInfo(state, formId)
  )

  const [values, setValues] = useState(valuesFromState)
  const dispatch = useDispatch()

  // Store as a ref so the useEffect can access the last value on unmount
  const currentValues = useRef(values)
  currentValues.current = values
  useEffect(() => {
    return () => {
      dispatch(formUpdated({ formId, values: currentValues.current }))
    }
  }, [dispatch, currentValues])

  const onStepChange = (_oldStep, newStep) => {
    dispatch(stepChanged({ formId, step: newStep }))
  }

  const onChange = useCallback(
    (updatedValues = {}) => {
      setValues(previousValues => ({ ...previousValues, ...updatedValues }))
    },
    [setValues]
  )

  const onSubmit = () => {
    dispatch(
      submitForm({
        formId,
        fields,
        values
      })
    )
  }

  return {
    step,
    values,
    formSubmissionStatus,
    onStepChange,
    onChange,
    onSubmit
  }
}

export default useForm
