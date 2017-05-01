import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './LoadingSpinner.sass';

export class LoadingSpinner extends Component {
  static propTypes = {
    className: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number
  };

  static defaultProps = {
    className: '',
    height: 180,
    width: 180
  };

  render = () => {
    const { className, width, height } = this.props;
    const circleStyles = `u-userStrokeColor ${styles.circle}`;

    return (
      <svg
        className={`${className} ${styles.spinner}`}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}>
        <circle
          className={circleStyles}
          cx='90'
          cy='90'
          r='70' />
      </svg>
    );
  }
}
