import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { isMobileBrowser } from 'utility/devices';

import { locals as styles } from './Card.scss';

const isMobile = isMobileBrowser();

export class Card extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    relativeWidth: PropTypes.bool
  };

  static defaultProps = {
    relativeWidth: isMobile
  };

  render() {
    return (
      <div className={classNames(styles.card, {
        [styles['card--relativeWidth']]: this.props.relativeWidth
      })}>
        {this.props.children}
      </div>
    );
  }
}
