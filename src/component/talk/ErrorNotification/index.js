import React from 'react';
import { locals as styles } from './styles/index.scss';
import PropTypes from 'prop-types';
import { Icon } from 'component/Icon';

const ErrorNotification = ({ message }) => {
  return (
    <div className={styles.error}>
      <Icon type='Icon--error' className={styles.errorIcon} />
      {message}
    </div>
  );
};

ErrorNotification.propTypes = {
  message: PropTypes.string
};

export default ErrorNotification;
