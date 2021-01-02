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
      isPrimaryParticipant={false}
      isReceiptVisible={false}
      isFirstInGroup={isFirstInGroup}
      label={isFirstMessageInAuthorGroup ? name : undefined}
      avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
      fields={fields}
    />
  )
}

FormResponseStructuredMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string,
    avatarUrl: PropTypes.string,
    fields: PropTypes.array,
    isFirstInGroup: PropTypes.bool,
    isFirstMessageInAuthorGroup: PropTypes.bool,
    isLastMessageInAuthorGroup: PropTypes.bool,
    name: PropTypes.string
  })
}

export default FormResponseStructuredMessage
