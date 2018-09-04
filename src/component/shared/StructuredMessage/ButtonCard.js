import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ButtonCard.scss';

class ButtonItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired
  }

  render() {
    return (
      <button className={styles.buttonItem}>
        {this.props.label}
      </button>
    );
  }
}

export class ButtonList extends Component {
  static propTypes = {
    contents: PropTypes.array
  }

  static defaultProps = {
    contents: []
  }

  render() {
    return (
      <ul className={styles.buttonList}>
        {this.props.contents.map((button, idx) => {
          return (
            <li key={idx}>
              <ButtonItem label={button.data.label} />
            </li>
          );
        })}
      </ul>
    );
  }
}

export class ButtonCard extends Component {
  static propTypes = {
    contents: PropTypes.array.isRequired,
    message: PropTypes.string
  };

  static defaultProps = {
    message: ''
  };

  render() {
    return (
      <div className={styles.cardContainer}>
        <div className={styles.cardMessage}>{this.props.message}</div>
        <ButtonList contents={this.props.contents} />
      </div>
    );
  }
}
