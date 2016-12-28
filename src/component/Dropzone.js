import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export class Dropzone extends Component {
  static propTypes = {
    activeClassName: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    disableClick: PropTypes.bool,
    onDragEnter: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDrop: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  static defaultProps = {
    activeClassName: '',
    className: '',
    disableClick: false,
    onDragEnter: () => {},
    onDragLeave: () => {},
    style: {}
  };

  constructor(props, context) {
    super(props, context);

    this.state = { isDragActive: false };
  }

  componentDidMount = () => {
    this.enterCounter = 0;
  }

  onDragEnter = (e) => {
    e.preventDefault();

    // Count the dropzone and any children that are entered.
    ++this.enterCounter;
    this.setState({ isDragActive: true });
    this.props.onDragEnter(e);
  }

  onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  onDragLeave = (e) => {
    e.preventDefault();

    // Only deactivate once the dropzone and all children have left.
    if (--this.enterCounter > 0) return;

    this.setState({ isDragActive: false });
    this.props.onDragLeave(e);
  }

  onDrop = (e) => {
    e.preventDefault();

    const droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;

    this.setState({ isDragActive: false });
    this.props.onDrop(droppedFiles, e);
  }

  onClick = () => {
    if (!this.props.disableClick) {
      this.fileInputEl.value = null;
      this.fileInputEl.click();
    }
  }

  render = () => {
    const dropzoneClasses = classNames({
      [this.props.className]: true,
      [this.props.activeClassName]: this.state.isDragActive
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
