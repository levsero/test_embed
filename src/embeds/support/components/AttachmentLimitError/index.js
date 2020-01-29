import React from 'react'
import PropTypes from 'prop-types'

import { Close } from '@zendeskgarden/react-notifications'
import { TEST_IDS } from 'src/constants/shared'
import { ErrorTitle, StyledAlert } from './styles'
import useTranslate from 'src/hooks/useTranslate'

const AttachmentLimitError = ({ handleClearError, maxFileCount }) => {
  const translate = useTranslate()
  const errorMessage = translate(
    'embeddable_framework.submitTicket.attachments.error.limit_reached',
    {
      maxFiles: maxFileCount
    }
  )

  return (
    <StyledAlert type="error" role="alert" data-testid={TEST_IDS.ERROR_MSG}>
      <ErrorTitle>{errorMessage}</ErrorTitle>
      <Close onClick={handleClearError} />
    </StyledAlert>
  )
}

AttachmentLimitError.propTypes = {
  maxFileCount: PropTypes.number.isRequired,
  handleClearError: PropTypes.func.isRequired
}
export default AttachmentLimitError
