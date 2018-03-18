import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'component/Icon';
import { ICONS } from 'constants/shared';
import { locals as styles } from './MessageError.scss';

export class MessageError extends Component {
  static propTypes = {
    errorMessage: PropTypes.string.isRequired,
    handleError: PropTypes.func,
    className: PropTypes.string
  };

  render() {
    return (
      <div className={styles.container}>
        <Icon
          className={styles.icon}
          type={ICONS.ERROR_FILL}
        />
        <span className={this.props.className} onClick={this.props.handleError}>
          {this.props.errorMessage}
        </span>
      </div>
    );
  }
}
