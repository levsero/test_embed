import getFields from 'classicSrc/embeds/support/utils/getFields'
import { useEffect, useState } from 'react'
import { useForm, useFormState } from 'react-final-form'

const useConditionalFields = (fields, conditions) => {
  const form = useForm()
  const [conditionalFields, setConditionalFields] = useState(
    getFields(form.getState().values, conditions, fields)
  )

  useFormState({
    onChange: (state) => {
      setConditionalFields(getFields(state.values, conditions, fields))
    },
  })

  useEffect(() => {
    setConditionalFields(getFields(form.getState().values, conditions, fields))
  }, [form, conditions, fields])

  return conditionalFields
}

export default useConditionalFields
