import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { bindMethods } from 'utility/utils';

export class Dropzone extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, Dropzone.prototype);

    this.state = {
      isDragActive: false
    };
  }

  componentDidMount() {
    this.enterCounter = 0;
  }

  onDragEnter(e) {
    e.preventDefault();

    // Count the dropzone and any children that are entered.
    ++this.enterCounter;
    this.setState({ isDragActive: true });
    this.props.onDragEnter(e);
  }

  onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  onDragLeave(e) {
    e.preventDefault();

    // Only deactivate once the dropzone and all children have left.
    if (--this.enterCounter > 0) {
      return;
    }

    this.setState({ isDragActive: false });
    this.props.onDragLeave(e);
  }

  onDrop(e) {
    e.preventDefault();

    const droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;

    this.setState({ isDragActive: false });
    this.props.onDrop(droppedFiles, e);
  }

  onClick() {
    if (!this.props.disableClick) {
      this.fileInputEl.value = null;
      this.fileInputEl.click();
    }
  }

  render() {
    const dropzoneClasses = classNames({
      [`${this.props.className}`]: true,
      [`${this.props.activeClassName}`]: this.state.isDragActive
    });
    const inputStyle = { display: 'none' };

    return (
      <div
        className={dropzoneClasses}
        style={this.props.style}
        onClick={this.onClick}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop} >
        {this.props.children}
        <input
          type='file'
          style={inputStyle}
          multiple={true}
          ref={(el) => this.fileInputEl = el}
          onChange={this.onDrop} />
      </div>
    );
  }
}

Dropzone.defaultProps = {
  onDragEnter: () => {},
  onDragLeave: () => {},
  style: {},
  className: '',
  activeClassName: '',
  disableClick: false
};

Dropzone.propTypes = {
  onDrop: PropTypes.func.isRequired,
  onDragEnter: PropTypes.func,
  style: PropTypes.object,
  onDragLeave: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  disableClick: PropTypes.bool
};
