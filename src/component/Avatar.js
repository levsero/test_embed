import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { locals as styles } from './Avatar.sass';

import { Icon } from 'component/Icon';

export class Avatar extends Component {
  renderCustom(classes) {
    return (
      <img
        className={classes}
        src={this.props.src} />
    );
  }

  renderDefault(classes) {
    return (
      <Icon
        className={classes}
        type="Icon--avatar" />
    );
  }

  render() {
    const classes = classNames({
      [styles.avatar]: true,
      [this.props.className]: true
    });

    return _.isEmpty(this.props.src)
         ? this.renderDefault(classes)
         : this.renderCustom(classes);
  }
}

Avatar.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string
};

Avatar.defaultProps = {
  src: '',
  className: ''
};
