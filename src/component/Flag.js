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
      ${styles.flag}
      ${styles.flag}-${this.props.country}
      ${styles.flagCustom}
      ${this.props.className}
    `;

    return (
      /* eslint max-len: 0 */
      <img className={flagClasses}
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBjcAAAAoAABjvuxtAAAAABJRU5ErkJggg=="
      />
    );
  }
}
