import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Text from './text';
import Results from './results';
import ChannelChoice from './channelChoice';
import PrimaryFeedback from './feedback/PrimaryFeedback';
import SecondaryFeedback from './feedback/SecondaryFeedback';
import { SlideAppear } from 'component/transition/SlideAppear';

import { locals as styles } from './style.scss';

export default class Messages extends Component {
  static propTypes = {
    messages: PropTypes.array,
    isVisitor: PropTypes.bool.isRequired,
    onMessageAnimated: PropTypes.func
  };

  static defaultProps = {
    messages: [],
    onMessageAnimated: () => {}
  };

  getMessage = (message) => {
    const { type, message: text, articles, sessionID } = message;

    switch (type) {
      case 'results':
        return (<Results articles={articles} sessionID={sessionID} />);
      case 'channelChoice':
        return (<ChannelChoice leadingMessage={text} useLeadingMessageAsFallback={message.fallback} />);
      case 'feedback':
        return message.feedbackType === 'primary' ? <PrimaryFeedback /> : <SecondaryFeedback />;
      default:
        return (<Text isVisitor={this.props.isVisitor} message={text} />);
    }
  }

  handleMessageAnimated = (message) => {
    return () => {
      this.props.onMessageAnimated(message);
    };
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
        className={styles.transitionWrapper}
      >
        <div className={styles.wrapper}>
          {this.getMessage(message)}
        </div>
      </SlideAppear>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        {_.map(this.props.messages, this.renderMessage)}
      </div>
    );
  }
}
