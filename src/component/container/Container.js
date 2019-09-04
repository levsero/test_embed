import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { locals as styles } from './Container.scss'
import { TEST_IDS } from 'src/constants/shared'

export class Container extends Component {
  static propTypes = {
    card: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    onClick: PropTypes.func,
    onDragEnter: PropTypes.func,
    style: PropTypes.object
  }

  static defaultProps = {
    card: false,
    className: '',
    isMobile: false,
    onClick: () => {},
    onDragEnter: () => {},
    style: null
  }

  render = () => {
    const platformClasses = this.props.isMobile ? styles.mobile : styles.desktop
    const styleClasses = this.props.card ? styles.card : ''

    return (
      <div
        role="presentation"
        onClick={this.props.onClick}
        className={`${styles.container} ${this.props.className} ${platformClasses} ${styleClasses}`}
        onDragEnter={this.props.onDragEnter}
        style={this.props.style}
        data-testid={TEST_IDS.PAGE_CONTAINER}
      >
        {this.props.children}
      </div>
    )
  }
}
