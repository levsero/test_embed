import React, { Component, PropTypes } from 'react';
import { locals as styles } from './LoadingSpinner.sass';

export class LoadingSpinner extends Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number
  };

  static defaultProps = {
    height: 180,
    width: 180
  };

  render = () => {
    const { width, height } = this.props;
    const circleStyles = `u-userStrokeColor ${styles.circle}`;

    return (
      <svg
        className={styles.spinner}
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
