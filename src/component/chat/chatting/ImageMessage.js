import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sharedPropTypes from 'types/shared';
import { FONT_SIZE } from 'constants/shared';

import { locals as styles } from './ImageMessage.scss';
import classNames from 'classnames';

export class ImageMessage extends Component {
  static propTypes = {
    className: PropTypes.string,
    placeholderEl: PropTypes.element,
    onImageLoad: PropTypes.func,
    file: sharedPropTypes.file,
  };

  static defaultProps = {
    onImageLoad: () => {}
  };

  constructor(props) {
    super();
    this.state = { loading: true };

    const { width, height } = props.file.metadata || {};

    if (width > 0 && height > 0) {
      const imageAspectRatio = width / height;
      let thumbnailWidth, thumbnailHeight;

      if (width > 180) {
        thumbnailWidth = 180;
        thumbnailHeight = 180 / imageAspectRatio;
      }
      if (thumbnailHeight > 180) {
        thumbnailHeight = 180;
        thumbnailWidth = 180 * imageAspectRatio;
      }
      this.state.thumbnailWidth = thumbnailWidth;
      this.state.thumbnailHeight = thumbnailHeight;
    }
  }

  onLoad = () => {
    this.setState({
      loading: false,
      thumbnailWidth: 0,
      thumbnailHeight: 0
    });
    this.props.onImageLoad();
  }

  render() {
    const imageClasses = classNames(
      styles.container,
      this.props.className,
      { [styles.hidden]: this.state.loading && !this.state.thumbnailWidth }
    );

    const imageSizeToStyle = (width, height) => {
      return (width > 0 && height > 0) ? {
        width: `${width/FONT_SIZE}rem`,
        height: `${height/FONT_SIZE}rem`
      } : {};
    };

    return (
      <div>
        {this.state.loading && this.props.placeholderEl}
        <div className={imageClasses} style={imageSizeToStyle(
          this.state.thumbnailWidth,
          this.state.thumbnailHeight
        )}>
          <a className={styles.link} target="_blank" href={this.props.file.url}>
            <img src={this.props.file.url} onLoad={this.onLoad} />
          </a>
        </div>
      </div>
    );
  }
}
