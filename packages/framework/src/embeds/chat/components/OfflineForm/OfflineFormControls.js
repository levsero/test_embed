import { useCallback } from 'react'
import { useForm } from 'react-final-form'
import useOnChange from 'src/hooks/useOnChange'

const OfflineFormControls = () => {
  const form = useForm()

  const onIdentify = useCallback(
    (values) => {
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

  useOnChange('identify', 'offline-form', onIdentify)
  useOnChange('prefill', 'offline-form', onPrefill)

  return null
}

export default OfflineFormControls
