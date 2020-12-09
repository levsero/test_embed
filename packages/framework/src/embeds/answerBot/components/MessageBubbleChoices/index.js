import React from 'react'
import PropTypes from 'prop-types'
import { TEST_IDS } from 'src/constants/shared'

import { Header, Container, Item } from './styles'

const renderLeadingMessage = leadingMessage => {
  if (!leadingMessage) return
  return <Header>{leadingMessage}</Header>
}

const renderChildren = (leadingMessage, children) => {
  const items = React.Children.toArray(children)

  return items.map((child, index) => (
    <Item key={index} top={!leadingMessage && index === 0} bottom={index === items.length - 1}>
      {child}
    </Item>
  ))
}

const MessageBubbleChoices = ({ leadingMessage, children }) => {
  const containerSize = leadingMessage ? 'small' : 'large'
  return (
    <Container size={containerSize} data-testid={TEST_IDS.AB_SELECTION_MESSAGE}>
      {renderLeadingMessage(leadingMessage)}
      {renderChildren(leadingMessage, children)}
    </Container>
  )
}

MessageBubbleChoices.propTypes = {
  leadingMessage: PropTypes.string,
  children: PropTypes.node.isRequired
}

export default MessageBubbleChoices
