import React from 'react';
import { locals as styles } from './styles/index.scss';
import PropTypes from 'prop-types';

const AverageWaitTime = ({ message }) => {
  return <p className={styles.message}>{message}</p>;
};

AverageWaitTime.propTypes = {
  message: PropTypes.string
};

export default AverageWaitTime;
