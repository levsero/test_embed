import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TEST_IDS } from 'src/constants/shared'

export class Dropzone extends Component {
  static propTypes = {
    activeClassName: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    onDragEnter: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDrop: PropTypes.func.isRequired,
    style: PropTypes.object,
    containerStyle: PropTypes.object
  }

  static defaultProps = {
    activeClassName: '',
    className: '',
    onDragEnter: () => {},
    onDragLeave: () => {},
    style: {},
    containerStyle: {}
  }

  constructor(props, context) {
    super(props, context)

    this.state = { isDragActive: false }
  }

  componentDidMount = () => {
    this.enterCounter = 0
  }

  onDragEnter = e => {
    e.preventDefault()

    // Count the dropzone and any children that are entered.
    ++this.enterCounter
    this.setState({ isDragActive: true })
    this.props.onDragEnter(e)
  }

  onDragOver = e => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  onDragLeave = e => {
    e.preventDefault()

    // Only deactivate once the dropzone and all children have left.
    if (--this.enterCounter > 0) return

    this.setState({ isDragActive: false })
    this.props.onDragLeave(e)
  }

  onDrop = e => {
    e.preventDefault()

    const droppedFiles = e.dataTransfer.files
    this.setState({ isDragActive: false })
    this.props.onDrop(droppedFiles, e)
  }

  render = () => {
    const activeStyle = this.state.isDragActive ? this.props.activeClassName : ''
    const dropzoneClasses = `${this.props.className} ${activeStyle}`

    return (
      <div
        data-testid={TEST_IDS.DROPZONE}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        style={this.props.containerStyle}
        onDrop={this.onDrop}
      >
        <div role="presentation" style={this.props.style} className={dropzoneClasses}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
