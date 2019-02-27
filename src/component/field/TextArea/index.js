import React from 'react';
import PropTypes from 'prop-types';
import { Label as LabelComponent } from '../';
import { TextField, Textarea, Label, Hint, Message } from '@zendeskgarden/react-textfields';

const Text = ({
  label,
  required,
  description,
  errorString,
  showError,
  textareaProps
}) => {
  const validation = showError ? 'error' : 'none';

  return (
    <TextField>
      <LabelComponent Component={Label} label={label} required={required} />
      {description && <Hint>{description}</Hint>}
      <Textarea {...textareaProps} validation={validation} />
      {showError && <Message validation='error'>{errorString}</Message>}
    </TextField>
  );
};

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
  })
};

export default Text;
