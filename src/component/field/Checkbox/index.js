import React from 'react';
import PropTypes from 'prop-types';

import {
  Checkbox as GardenCheckbox,
  Label as CheckboxLabel,
  Hint as CheckboxHint,
  Message as Message
} from '@zendeskgarden/react-checkboxes';

const Checkbox = ({ title, description, showError, errorString, checkboxProps }) => {
  return (
    <GardenCheckbox {...checkboxProps}>
      <CheckboxLabel dangerouslySetInnerHTML={{ __html: title }} />
      {description && <CheckboxHint>{description}</CheckboxHint>}
      {showError && <Message validation='error'>{errorString}</Message>}
    </GardenCheckbox>
  );
};

Checkbox.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  showError: PropTypes.bool.isRequired,
  errorString: PropTypes.string,
  checkboxProps: PropTypes.shape({
    checked: PropTypes.oneOf([0, 1]),
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  })
};

export default Checkbox;
