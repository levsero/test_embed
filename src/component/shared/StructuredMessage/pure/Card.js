import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './Card.scss';

export class Card extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <div className={styles.card}>
        {this.props.children}
      </div>
    );
  }
}
