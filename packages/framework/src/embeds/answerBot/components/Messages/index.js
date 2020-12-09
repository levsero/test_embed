import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Text from 'src/embeds/answerBot/components/Text'
import SearchResults from 'src/embeds/answerBot/components/SearchResults'
import ContextualSearchResults from 'src/embeds/answerBot/components/ContextualSearchResults'
import ChannelChoice from 'src/embeds/answerBot/components/ChannelChoice'
import PrimaryFeedback from 'src/embeds/answerBot/components/ConversationFeedback/PrimaryFeedback'
import SecondaryFeedback from 'src/embeds/answerBot/components/ConversationFeedback/SecondaryFeedback'
import BotTyping from 'src/embeds/answerBot/components/BotTyping'

import { Container, SlideAppear, Message } from './styles'

export default class Messages extends Component {
  static propTypes = {
    messages: PropTypes.array,
    isVisitor: PropTypes.bool.isRequired,
    onMessageAnimated: PropTypes.func
  }

  static defaultProps = {
    messages: [],
    onMessageAnimated: () => {}
  }

  getMessage = message => {
    const { type, message: text, articles, sessionID } = message

    switch (type) {
      case 'contextualSearchResults':
        return <ContextualSearchResults />
      case 'results':
        return <SearchResults articles={articles} sessionID={sessionID} />
      case 'channelChoice':
        return (
          <ChannelChoice leadingMessage={text} useLeadingMessageAsFallback={message.fallback} />
        )
      case 'feedback':
        return message.feedbackType === 'primary' ? <PrimaryFeedback /> : <SecondaryFeedback />
      case 'botTyping':
        return <BotTyping />
      default:
        return <Text isVisitor={this.props.isVisitor} message={text} />
    }
  }

  handleMessageAnimated = message => {
    return () => {
      this.props.onMessageAnimated(message)
    }
  }

  renderMessage = (message = {}, key) => {
    return (
      <SlideAppear
        key={key}
        transitionOnMount={message.shouldAnimate}
        duration={200}
        startPosHeight={'-10px'}
        endPosHeight={'0px'}
        onEntered={this.handleMessageAnimated(message)}
      >
        <Message>{this.getMessage(message)}</Message>
      </SlideAppear>
    )
  }

  render() {
    return <Container>{_.map(this.props.messages, this.renderMessage)}</Container>
  }
}
