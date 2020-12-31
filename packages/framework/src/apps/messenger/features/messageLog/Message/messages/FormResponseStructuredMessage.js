import React from 'react'
import PropTypes from 'prop-types'
import { FormResponseMessage } from '@zendesk/conversation-components'

const FormResponseStructuredMessage = ({
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
    <FormResponseMessage
      fields={fields}
      isFirstInGroup={isFirstInGroup}
      avatar={isLastMessageInAuthorGroup ? avatarUrl : null}
      label={isFirstMessageInAuthorGroup ? name : null}
    />
  )
}

FormResponseStructuredMessage.propTypes = {
  message: PropTypes.shape({
    avatarUrl: PropTypes.string,
    fields: PropTypes.array,
    isFirstInGroup: PropTypes.bool,
    isFirstMessageInAuthorGroup: PropTypes.bool,
    isLastMessageInAuthorGroup: PropTypes.bool,
    name: PropTypes.string
  })
}

export default FormResponseStructuredMessage
