import PropTypes from 'prop-types'
import useUpdateOnPrefill from 'embeds/support/hooks/useUpdateOnPrefill'
import useFormBackup from 'embeds/support/hooks/useFormBackup'

const FormStateManager = ({ formName }) => {
  useFormBackup(formName)
  useUpdateOnPrefill()

  return null
}

FormStateManager.propTypes = { formName: PropTypes.string }

export default FormStateManager
