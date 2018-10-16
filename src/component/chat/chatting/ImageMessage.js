import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sharedPropTypes from 'types/shared';

import { locals as styles } from './ImageMessage.scss';
import classNames from 'classnames';

export class ImageMessage extends Component {
  static propTypes = {
    className: PropTypes.string,
    placeholderEl: PropTypes.element,
    onImageLoad: PropTypes.func,
    file: sharedPropTypes.file
  };

  static defaultProps = {
    onImageLoad: () => {}
  };

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.thumbnail = new window.Image();
    this.thumbnail.src = this.props.file.url;
    this.thumbnail.onload = this.onLoad;
  }

  onLoad = () => {
    this.thumbnail = null;
    this.setState({ loading: false });
    this.props.onImageLoad();
  }

  render() {
    const imageClasses = classNames(
      styles.container,
      this.props.className
    );

    let imageStyle = {};

    if (!this.state.loading) {
      imageStyle.backgroundImage = `url("${this.props.file.url}")`;
    }

    return (
      <div>
        {this.state.loading && this.props.placeholderEl}
        <a className={styles.link} target="_blank" href={this.props.file.url}>
          <div className={imageClasses} style={imageStyle}></div>
        </a>
      </div>
    );
  }
}
