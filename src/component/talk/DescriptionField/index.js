import React from 'react';
import { locals as styles } from './styles/index.scss';
import PropTypes from 'prop-types';
import { TextField, Textarea, Label } from '@zendeskgarden/react-textfields';

const DescriptionField = ({ label, defaultValue }) => {
  return (
    <TextField className={styles.textField}>
      <Label dangerouslySetInnerHTML={{ __html: label }}/>
      <Textarea
        defaultValue={defaultValue}
        rows='4'
        name='description' />
    </TextField>
  );
};

DescriptionField.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
};

export default DescriptionField;
