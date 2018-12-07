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
    file: sharedPropTypes.file.isRequired
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
    this.thumbnail.onload = this.onLoad;
    this.thumbnail.src = this.props.file.url;
  }

  onLoad = () => {
    this.setState({ loading: false }, () => {
      this.thumbnail = null;
      this.props.onImageLoad();
    });
  }

  render() {
    const imageClasses = classNames(
      styles.container,
      this.props.className
    );

    const imageStyle = {
      backgroundImage: `url("${this.props.file.url}")`
    };

    const thumbnailDiv = (<a className={styles.link} target="_blank" href={this.props.file.url}>
      <div className={imageClasses} style={imageStyle} />
    </a>);

    const placeholder = this.props.placeholderEl ||
      (<div className={imageClasses}>
        <div className={styles.spinner} />
      </div>);

    return (
      <div>
        {this.state.loading ? placeholder : thumbnailDiv}
      </div>
    );
  }
}
