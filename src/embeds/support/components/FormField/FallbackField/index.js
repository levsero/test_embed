import { useEffect } from 'react'
import PropTypes from 'prop-types'
import logger from 'utility/logger'

const FallbackField = ({ field }) => {
  useEffect(() => {
    logger.error(`Support contact form: An invalid field of type "${field.type}" was rendered`)
  }, [field])

  return null
}

FallbackField.propTypes = {
  field: PropTypes.shape({
    type: PropTypes.string
  })
}

export default FallbackField
