import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ButtonCard.scss';

import { Card } from './pure/Card';
import { ButtonList } from './pure/ButtonList';
import { Button } from './pure/Button';

export class ButtonCard extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    message: PropTypes.string,
    relativeWidth: PropTypes.bool
  };

  static defaultProps = {
    message: ''
  };

  render() {
    const { message, children, relativeWidth } = this.props;

    return (
      <Card relativeWidth={relativeWidth}>
        <div className={styles.message}>{message}</div>
        <ButtonList>
          {children}
        </ButtonList>
      </Card>
    );
  }
}

export { Button };
