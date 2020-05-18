import { useForm } from 'react-final-form'
import { useCallback } from 'react'
import useOnChange from 'src/hooks/useOnChange'

const PrechatFormControls = () => {
  const form = useForm()

  const onIdentify = useCallback(
    values => {
      form.batch(() => {
        if (values.display_name) {
          form.change('name', values.display_name)
        }

        if (values.email) {
          form.change('email', values.email)
        }
      })
    },
    [form]
  )

  const onPrefill = useCallback(
    (values = {}) => {
      form.batch(() => {
        if (values.name) {
          form.change('name', values.name)
        }

        if (values.email) {
          form.change('email', values.email)
        }

        if (values.phone) {
          form.change('phone', values.phone)
        }
      })
    },
    [form]
  )

  const onDepartmentSelect = useCallback(
    (values = {}) => {
      form.batch(() => {
        if (values.departmentId !== form.values?.department) {
          form.change('department', values.departmentId)
        }
      })
    },
    [form]
  )

  useOnChange('identify', 'prechat-form', onIdentify)
  useOnChange('prefill', 'prechat-form', onPrefill)
  useOnChange('chatDepartmentSelect', 'prechat-form', onDepartmentSelect)

  return null
}

export default PrechatFormControls
