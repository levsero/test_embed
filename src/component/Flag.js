import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './Flag.sass';

export class Flag extends Component {
  static propTypes = {
    country: PropTypes.string.isRequired,
    className: PropTypes.string
  };

  render = () => {
    const flagClasses = `
      ${styles.container}
      ${styles.flag}
      ${styles.flag}-${this.props.country}
      ${this.props.className}
    `;

    return <span className={flagClasses} />;
  }
}
