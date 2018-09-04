import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonList } from './ButtonCard';

import { locals as styles } from './MessageCard.scss';

export class MessageCard extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    buttons: PropTypes.array
  };

  static defaultProps = {
    imageUrl: null,
    buttons: []
  };

  render() {
    return (
      <div className={styles.cardContainer}>
        <div className={styles.heroImage}>
          <img src={this.props.imageUrl} />
        </div>
        <div className={styles.mainPanel}>
          <h2>{this.props.title}</h2>
          <p>{this.props.body}</p>
        </div>
        <ButtonList content={this.props.buttons} />
      </div>
    );
  }
}
