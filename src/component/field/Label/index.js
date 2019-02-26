import React from 'react';
import PropTypes from 'prop-types';

import { getStyledLabelText } from 'utility/fields';

const Label = ({ Component, label, required }) => {
  const labelText = getStyledLabelText(label, required);

  return (
    <Component dangerouslySetInnerHTML={{ __html: labelText }} />
  );
};

Label.propTypes = {
  Component: PropTypes.func.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool.isRequired,
};

export default Label;
