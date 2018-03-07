import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ImageMessage.scss';

export class ImageMessage extends Component {
  static propTypes = {
    className: PropTypes.string,
    imgSrc: PropTypes.string,
    placeholderEl: PropTypes.element
  };

  constructor() {
    super();
    this.state = { loading: true };
  }

  onLoad = () => {
    this.setState({ loading: false });
  }

  render() {
    const { className, imgSrc, placeholderEl } = this.props;
    const imageStyles = this.state.loading ? styles.hidden : '';

    return (
      <div>
        {this.state.loading && placeholderEl}
        <div className={`${styles.container} ${className} ${imageStyles}`}>
          <a className={styles.link} target="_blank" href={imgSrc}>
            <img src={imgSrc} onLoad={this.onLoad} />
          </a>
        </div>
      </div>
    );
  }
}
