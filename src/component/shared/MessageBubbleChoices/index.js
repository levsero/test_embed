import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TEST_IDS } from 'src/constants/shared'

import { Header, Container, FirstItem, LastItem, Item } from './styles'

export class MessageBubbleChoices extends Component {
  static propTypes = {
    leadingMessage: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    leadingMessage: null
  }

  renderLeadingMessage = () => {
    const { leadingMessage } = this.props

    if (!leadingMessage) return
    return <Header>{leadingMessage}</Header>
  }

  renderChildItems = () => {
    const children = React.Children.toArray(this.props.children)

    return children.map((child, index) => {
      let Component = Item

      if (!this.props.leadingMessage && index === 0) {
        Component = FirstItem
      }

      if (index === children.length - 1) {
        Component = LastItem
      }

      return (
        <Component key={index} onlyItem={children.length === 1}>
          {child}
        </Component>
      )
    })
  }

  render() {
    const size = this.props.leadingMessage ? 'small' : 'large'
    return (
      <Container size={size} data-testid={TEST_IDS.AB_SELECTION_MESSAGE}>
        {this.renderLeadingMessage()}
        {this.renderChildItems()}
      </Container>
    )
  }
}
