import React from 'react';
import PropTypes from 'prop-types';
import Label from 'src/component/field/Label';

import {
  Checkbox as GardenCheckbox,
  Label as CheckboxLabel,
  Hint as CheckboxHint,
  Message as Message
} from '@zendeskgarden/react-checkboxes';

const Checkbox = ({ title, required, description, renderError, errorString, checkboxProps }) => {
  const checkboxError = renderError
    ? (
      <Message validation='error'>
        {errorString}
      </Message>
    )
    : null;

  return (
    <GardenCheckbox {...checkboxProps}>
      <Label Component={CheckboxLabel} label={title} required={required} />
      {description && <CheckboxHint>{description}</CheckboxHint>}
      {checkboxError}
    </GardenCheckbox>
  );
};

Checkbox.propTypes = {
  title: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  description: PropTypes.string,
  renderError: PropTypes.bool.isRequired,
  errorString: PropTypes.string,
  checkboxProps: PropTypes.shape({})
};

export default Checkbox;
