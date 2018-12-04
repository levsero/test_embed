import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { locals as styles } from './Card.scss';

export class Card extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  render() {
    return (
      <div className={classNames(styles.card, this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}
