import React from 'react'
import PropTypes from 'prop-types'

import FormResponse from 'src/apps/messenger/features/sunco-components/FormResponse'

const FormResponseMessage = ({
  message: { fields, avatarUrl, name, isFirstInGroup, isLastInGroup }
}) => {
  return (
    <FormResponse
      fields={fields}
      avatar={isLastInGroup ? avatarUrl : undefined}
      label={isFirstInGroup ? name : undefined}
      isFirstInGroup={isFirstInGroup}
    />
  )
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
