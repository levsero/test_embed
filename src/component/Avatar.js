import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { locals as styles } from './Avatar.sass';

import { Icon } from 'component/Icon';

export class Avatar extends Component {
  static propTypes = {
    className: PropTypes.string,
    src: PropTypes.string
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

  renderDefault = (classes) => {
    return (
      <Icon
        className={classes}
        type="Icon--avatar" />
    );
  }

  render = () => {
    const classes = `${styles.avatar} ${this.props.className}`;

    return _.isEmpty(this.props.src)
         ? this.renderDefault(classes)
         : this.renderCustom(classes);
  }
}
