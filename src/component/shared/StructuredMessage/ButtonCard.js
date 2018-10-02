import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ButtonCard.scss';

import { Card } from './pure/Card';
import { ButtonList } from './pure/ButtonList';
import { Button } from './pure/Button';

export class ButtonCard extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    message: PropTypes.string
  };

  static defaultProps = {
    message: ''
  };

  render() {
    const { message, children } = this.props;

    return (
      <Card>
        <div className={styles.message}>{message}</div>
        <ButtonList>
          {children}
        </ButtonList>
      </Card>
    );
  }
}

export { Button };
