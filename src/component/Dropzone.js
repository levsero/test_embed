import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
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

    // This is tricky. During the drag even the dataTransfer.files is null
    // But Chrome implements some drag store, which is accesible via dataTransfer.items
    const dataTransferItems = e.dataTransfer && e.dataTransfer.items ? e.dataTransfer.items : [];

    this.setState({
      isDragActive: true
    });

    if (this.props.onDragEnter) {
      this.props.onDragEnter.call(this, e);
    }
  }

  onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  onDragLeave(e) {
    e.preventDefault();

    // Only deactivate once the dropzone and all children was left.
    if (--this.enterCounter > 0) {
      return;
    }

    this.setState({
      isDragActive: false
    });

    if (this.props.onDragLeave) {
      this.props.onDragLeave.call(this, e);
    }
  }

  onDrop(e) {
    e.preventDefault();

    // Reset the counter along with the drag on a drop.
    this.enterCounter = 0;

    this.setState({
      isDragActive: false
    });

    const droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    const max = droppedFiles.length;
    const files = [];

    for (let i = 0; i < max; i++) {
      const file = droppedFiles[i];
      // We might want to disable the preview creation to support big files
      if (!this.props.disablePreview) {
        file.preview = window.URL.createObjectURL(file);
      }
      files.push(file);
    }

    if (this.props.onDrop) {
      this.props.onDrop.call(this, files, e);
    }
  }

  onClick() {
    if (!this.props.disableClick) {
      this.open();
    }
  }

  open() {
    this.fileInputEl.value = null;
    this.fileInputEl.click();
  }

  render() {
    const activeClassName = this.props.activeClassName;

    let activeStyle = this.props.activeStyle;
    let className = this.props.className;
    let style = this.props.style;

    const omitList = [
      'activeClassName',
      'activeStyle',
      'className',
      'style'
    ];

    const { isDragActive } = this.state;

    className = className || '';

    if (isDragActive && activeClassName) {
      className += ' ' + activeClassName;
    }

    let appliedStyle;
    if (activeStyle && isDragActive) {
      appliedStyle = _.extend({}, style, activeStyle);
    } else {
      appliedStyle = _.extend({}, style);
    }

    const inputAttributes = {
      type: 'file',
      style: { display: 'none' },
      multiple: true,
      ref: el => this.fileInputEl = el,
      onChange: this.onDrop
    };

    return (
      <div
        className={className}
        style={appliedStyle}
        onClick={this.onClick}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {this.props.children}
        <input
          {...inputAttributes}
        />
      </div>
    );
  }
}

Dropzone.defaultProps = {
  disableClick: false
};

Dropzone.propTypes = {
  onDrop: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  style: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  disableClick: PropTypes.bool
};
