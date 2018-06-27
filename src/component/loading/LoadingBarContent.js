import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { locals as styles } from './LoadingBarContent.scss';

export class LoadingBarContent extends Component {
  static propTypes = {
    containerClasses: PropTypes.string
  };

  static defaultProps = {
    containerClasses: ''
  };

  render = () => {
    const containerStyles = classNames(styles.container, this.props.containerClasses);

    return (
      <div className={containerStyles}>
        <div className={styles.barWidth30Percent} />
        <div className={styles.barWidth90Percent} />
        <div className={styles.barWidth90Percent} />
        <div className={styles.barWidth90Percent} />
        <div className={styles.barWidth70Percent} />
      </div>
    );
  }
}
