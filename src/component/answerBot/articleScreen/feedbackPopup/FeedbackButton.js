import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './FeedbackButton.scss';

export class FeedbackButton extends Component {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func
  };

  static defaultProps = {
    className: '',
    onClick: () => {}
  };

  render = () => {
    const buttonClasses = `
      ${styles.button}
      ${this.props.className}
    `;

    return (
      <button
        onClick={this.props.onClick}
        className={buttonClasses}>
        {this.props.label}
      </button>
    );
  }
}
