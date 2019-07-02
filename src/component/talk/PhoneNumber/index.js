import React from 'react';
import { locals as styles } from './styles/index.scss';
import PropTypes from 'prop-types';

const PhoneNumber = ({ phoneNumber, formattedPhoneNumber }) => {
  return (
    <a className={styles.phoneLink} href={`tel:${phoneNumber}`} target='_blank'>
      {formattedPhoneNumber}
    </a>
  );
};

PhoneNumber.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  formattedPhoneNumber: PropTypes.string.isRequired,
};

export default PhoneNumber;
