import React from 'react';
import PropTypes from 'prop-types';
import { Label as LabelComponent } from '../';

import { TextField, Input, Hint, Message, Label } from '@zendeskgarden/react-textfields';

const Text = ({
  label,
  required,
  description,
  value,
  onChange,
  name,
  errorString,
  pattern,
  type,
  showError
}) => {
  return (
    <TextField>
      <LabelComponent Component={Label} label={label} required={required} />
      {description && <Hint>{description}</Hint>}
      <Input value={value} onChange={onChange} name={name} pattern={pattern} type={type} />
      {showError && <Message validation='error'>{errorString}</Message>}
    </TextField>
  );
};

Text.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  showError: PropTypes.bool.isRequired,
  description: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  errorString: PropTypes.string,
  value: PropTypes.string,
  pattern: PropTypes.object,
  type: PropTypes.string,
};

export default Text;
