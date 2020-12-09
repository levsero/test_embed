import React from 'react'
import PropTypes from 'prop-types'

import FormResponse from 'src/apps/messenger/features/sunco-components/FormResponse'

const FormResponseMessage = ({
  message: {
    avatarUrl,
    fields,
    isFirstInGroup,
    isFirstMessageInAuthorGroup,
    isLastMessageInAuthorGroup,
    name
  }
}) => {
  return (
    <FormResponse
      fields={fields}
      isFirstInGroup={isFirstInGroup}
      avatar={isLastMessageInAuthorGroup ? avatarUrl : null}
      label={isFirstMessageInAuthorGroup ? name : null}
    />
  )
}

FormResponseMessage.propTypes = {
  message: PropTypes.shape({
    avatarUrl: PropTypes.string,
    fields: PropTypes.array,
    isFirstInGroup: PropTypes.bool,
    isFirstMessageInAuthorGroup: PropTypes.bool,
    isLastMessageInAuthorGroup: PropTypes.bool,
    name: PropTypes.string
  })
}

export default FormResponseMessage
