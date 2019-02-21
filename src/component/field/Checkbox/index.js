import React from 'react';
import PropTypes from 'prop-types';

import {
  Checkbox as GardenCheckbox,
  Label as CheckboxLabel,
  Hint as CheckboxHint,
  Message as Message
} from '@zendeskgarden/react-checkboxes';

const Checkbox = ({ title, description, renderError, errorString, checkboxProps }) => {
  const checkboxError = renderError
    ? (
      <Message validation='error'>
        {errorString}
      </Message>
    )
    : null;

  return (
    <GardenCheckbox {...checkboxProps}>
      <CheckboxLabel dangerouslySetInnerHTML={{ __html: title }} />
      {description && <CheckboxHint>{description}</CheckboxHint>}
      {checkboxError}
    </GardenCheckbox>
  );
};

Checkbox.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  renderError: PropTypes.bool.isRequired,
  errorString: PropTypes.string,
  checkboxProps: PropTypes.shape({
    checked: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number
    ]),
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  })
};

export default Checkbox;
