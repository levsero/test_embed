import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { locals as styles } from './Avatar.scss';

import { Icon } from 'component/Icon';

export class Avatar extends Component {
  static propTypes = {
    className: PropTypes.string,
    src: PropTypes.string,
    fallbackIcon: PropTypes.string.isRequired
  };

  static defaultProps = {
    className: '',
    src: ''
  };

  renderCustom = (classes) => {
    return (
      <img
        className={classes}
        src={this.props.src} />
    );
  }

  renderDefault = (classes, icon) => {
    return (
      <Icon
        className={classes}
        type={icon} />
    );
  }

  render = () => {
    const { src, className, fallbackIcon } = this.props;
    const classes = `${styles.avatar} ${className}`;

    return _.isEmpty(src)
      ? this.renderDefault(classes, fallbackIcon)
      : this.renderCustom(classes);
  }
}
