import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ImageMessage.scss';
import classNames from 'classnames';

export class ImageMessage extends Component {
  static propTypes = {
    className: PropTypes.string,
    imgSrc: PropTypes.string,
    placeholderEl: PropTypes.element,
    handleImageLoad: PropTypes.func
  };

  static defaultProps = {
    handleImageLoad: () => {}
  };

  constructor() {
    super();
    this.state = { loading: true };
  }

  onLoad = () => {
    this.setState({ loading: false });
    this.props.handleImageLoad();
  }

  render() {
    const imageClasses = classNames(
      styles.container,
      this.props.className,
      { [styles.hidden]: this.state.loading }
    );

    return (
      <div>
        {this.state.loading && this.props.placeholderEl}
        <div className={imageClasses}>
          <a className={styles.link} target="_blank" href={this.props.imgSrc}>
            <img src={this.props.imgSrc} onLoad={this.onLoad} />
          </a>
        </div>
      </div>
    );
  }
}
