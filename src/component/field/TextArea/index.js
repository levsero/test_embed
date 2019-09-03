import React from 'react'
import PropTypes from 'prop-types'
import { Field, Textarea, Label, Hint, Message } from '@zendeskgarden/react-forms'
import { renderLabel } from 'utility/fields'

const Text = ({ label, required, description, errorString, showError, textareaProps }) => {
  const validation = showError ? 'error' : undefined

  return (
    <Field>
      {renderLabel(Label, label, required)}
      {description && <Hint>{description}</Hint>}
      <Textarea {...textareaProps} validation={validation} />
      {showError && <Message validation="error">{errorString}</Message>}
    </Field>
  )
}

Text.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  showError: PropTypes.bool.isRequired,
  description: PropTypes.string,
  errorString: PropTypes.string,
  textareaProps: PropTypes.shape({
    type: PropTypes.string,
    pattern: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool
  })
}

export default Text
