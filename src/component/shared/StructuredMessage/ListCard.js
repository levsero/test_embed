import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonList } from './ButtonCard';

import { locals as styles } from './ListCard.scss';

export class ListItem extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    imageUrl: PropTypes.string
  }

  static defaultProps = {
    imageUrl: null
  }

  render() {
    return (
      <button className={styles.panelContainer}>
        <div className={styles.panelText}>
          <h2>{this.props.title}</h2>
          <p>{this.props.body}</p>
        </div>
        <div className={styles.panelImage}>
          <img src={this.props.imageUrl} />
        </div>
      </button>
    );
  }
}

export class ListCard extends Component {
  static propTypes = {
    contents: PropTypes.array.isRequired,
    buttons: PropTypes.array
  };

  static defaultProps = {
    buttons: []
  };

  render() {
    return (
      <div className={styles.cardContainer}>
        <ul className={styles.panelList}>
          {this.props.contents.map((item, idx) => {
            return (
              <li key={idx}>
                <ListItem {...item.data} />
              </li>
            );
          })}
        </ul>
        <ButtonList contents={this.props.buttons} />
      </div>
    );
  }
}
