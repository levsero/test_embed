import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formUpdated, getFormInfo, submitForm } from './store'

const useForm = ({ formId, fields }) => {
  const { values: valuesFromState, formSubmissionStatus } = useSelector(state =>
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
    values,
    formSubmissionStatus,
    onChange,
    onSubmit
  }
}

export default useForm
