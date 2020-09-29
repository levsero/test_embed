import React from 'react'
import PropTypes from 'prop-types'

import FormResponse from 'src/apps/messenger/features/sunco-components/FormResponse'

const FormResponseMessage = ({ message: { fields, isFirstInGroup } }) => {
  return <FormResponse fields={fields} isFirstInGroup={isFirstInGroup} />
}

FormResponseMessage.propTypes = {
  message: PropTypes.shape({
    isFirstInGroup: PropTypes.bool,
    fields: PropTypes.array,
    avatarUrl: PropTypes.string,
    name: PropTypes.string
  })
}

export default FormResponseMessage
