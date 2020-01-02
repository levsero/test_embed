import { useDispatch } from 'react-redux'
import { useForm } from 'react-final-form'
import { useEffect } from 'react'
import { setFormState } from 'embeds/support/actions'

const useFormBackup = formName => {
  const dispatch = useDispatch()
  const form = useForm()

  useEffect(() => {
    return () => {
      dispatch(setFormState(formName, form.getState().values))
    }
  }, [form, dispatch, formName])
}

export default useFormBackup
