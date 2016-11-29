import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import css from './LoadingSpinner.sass';

import { isDevice } from 'utility/devices';

const styles = css.locals;

export class LoadingSpinner extends Component {
  render() {
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

LoadingSpinner.defaultProps = {
  width: 180,
  height: 180
};

LoadingSpinner.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};

