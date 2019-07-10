import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { locals as styles } from './MessageBubbleChoices.scss'

export class MessageBubbleChoices extends Component {
  static propTypes = {
    leadingMessage: PropTypes.string,
    containerStyle: PropTypes.string,
    leadingMessageStyle: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    leadingMessage: null,
    containerStyle: '',
    leadingMessageStyle: ''
  }

  renderLeadingMessage = () => {
    const { leadingMessage, leadingMessageStyle } = this.props

    if (!leadingMessage) return
    return (
      <div className={`${styles.header} ${styles.firstItem} ${leadingMessageStyle}`}>
        {leadingMessage}
      </div>
    )
  }

  renderChildItems = () => {
    const children = React.Children.toArray(this.props.children)

    return children.map((child, index) => {
      let childStyle = ''

      if (!this.props.leadingMessage && index === 0) {
        childStyle = styles.firstItem
      }

      if (index === children.length - 1) {
        childStyle = `${childStyle} ${styles.lastItem}`
      }

      return (
        <div key={index} className={`${childStyle} ${styles.optionItem}`}>
          {child}
        </div>
      )
    })
  }

  render() {
    return (
      <div className={`${styles.messageBubble} ${this.props.containerStyle}`}>
        {this.renderLeadingMessage()}
        {this.renderChildItems()}
      </div>
    )
  }
}
