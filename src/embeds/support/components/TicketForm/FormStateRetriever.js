import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { setFormState } from 'src/embeds/support/actions'

import { useForm } from 'react-final-form'

const FormStateRetriever = ({ formName }) => {
  const dispatch = useDispatch()
  const formObject = useForm()

  useEffect(() => {
    return () => {
      dispatch(setFormState(formName, formObject.getState().values))
    }
  }, [formObject, dispatch, formName])

  return null
}

FormStateRetriever.propTypes = { formName: PropTypes.string }

export default FormStateRetriever
