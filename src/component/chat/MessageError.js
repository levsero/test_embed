import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'component/Icon';
import { ICONS } from 'constants/shared';
import { locals as styles } from './MessageError.scss';

import classNames from 'classnames';

export class MessageError extends Component {
  static propTypes = {
    errorMessage: PropTypes.string.isRequired,
    handleError: PropTypes.func,
    className: PropTypes.string
  };

  render() {
    const errorClasses = classNames(styles.container, this.props.className);

    let errorTag;

    if (this.props.handleError) {
      errorTag = (
        <a className={styles.messageErrorLink}
           onClick={this.props.handleError}>
           {this.props.errorMessage}
        </a>
      );
    } else {
      errorTag = this.props.errorMessage;
    }

    return (
      <div className={errorClasses}>
        <Icon
          className={styles.icon}
          type={ICONS.ERROR_FILL}
        />
        {errorTag}
      </div>
    );
  }
}
