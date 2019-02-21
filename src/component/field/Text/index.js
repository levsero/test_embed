import React from 'react';
import PropTypes from 'prop-types';
import LabelComponent from '../Label';

import { TextField,Input, Hint, Message } from '@zendeskgarden/react-textfields';

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
  Component,
  showErrors
}) => {
  return (
    <TextField>
      <LabelComponent Component={Component} label={label} required={required} />
      {description && <Hint>{description}</Hint>}
      <Input value={value} onChange={onChange} name={name} pattern={pattern} type={type} />
      {showErrors && <Message validation='error'>{errorString}</Message>}
    </TextField>
  );
};

Text.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  showErrors: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  errorString: PropTypes.string.isRequired,
  value: PropTypes.string,
  pattern: PropTypes.object,
  type: PropTypes.string,
  Component: PropTypes.func.isRequired,
};

export default Text;
