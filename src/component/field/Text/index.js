import React from 'react';
import PropTypes from 'prop-types';
import { renderLabel } from 'utility/fields';

import { TextField, Input, Hint, Message, Label } from '@zendeskgarden/react-textfields';

const Text = ({
  label,
  required,
  description,
  errorString,
  showError,
  inputProps
}) => {
  const validation = showError ? 'error' : 'none';

  return (
    <TextField>
      {renderLabel(Label, label, required)}
      {description && <Hint>{description}</Hint>}
      <Input {...inputProps} validation={validation} />
      {showError && <Message validation={validation}>{errorString}</Message>}
    </TextField>
  );
};

Text.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  showError: PropTypes.bool.isRequired,
  description: PropTypes.string,
  errorString: PropTypes.string,
  inputProps: PropTypes.shape({
    type: PropTypes.string,
    pattern: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
  })
};

export default Text;
