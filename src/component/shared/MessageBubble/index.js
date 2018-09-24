import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './MessageBubble.scss';
import { MessageOptions }  from 'component/shared/MessageOptions';
import Linkify from 'react-linkify';
import { i18n } from 'service/i18n';

export class MessageBubble extends Component {
  static propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    translatedMessage: PropTypes.string,
    options: PropTypes.array,
    handleSendMsg: PropTypes.func
  };

  static defaultProps = {
    options: [],
    handleSendMsg: () => {},
    translatedMessage: ''
  }

  constructor(props) {
    super(props);

    this.state = {
      showOriginal: true
    };
  }

  renderOptions = () => {
    const { handleSendMsg, options } = this.props;

    return options.length ? (
      <MessageOptions
        isMessageBubbleLinked={true}
        onOptionClick={handleSendMsg}
        optionItems={options} />
    ) : null;
  }

  renderTranslateLink = () => {
    if (!this.props.translatedMessage) return null;

    const translateText = this.state.showOriginal ?
      i18n.t('embeddable_framework.chat.show_translated') :
      i18n.t('embeddable_framework.chat.show_original');
    const onTranslatedMessageClick = () => {
      this.setState({
        showOriginal: !this.state.showOriginal
      });
    };

    return (
      <a className={styles.translateLink} onClick={onTranslatedMessageClick}>{translateText}</a>
    );
  }

  renderMessage = () => {
    if (this.state.showOriginal) {
      return this.props.message;
    }
    return this.props.translatedMessage;
  }

  render() {
    const messageBubbleClasses = this.props.options.length ? styles.messageBubbleWithOptions : styles.messageBubble;

    return (
      <div>
        <div className={`${messageBubbleClasses} ${this.props.className}`}>
          <Linkify properties={{ className: styles.link, target: '_blank' }}>
            {this.renderMessage()}
          </Linkify>
          {this.renderTranslateLink()}
        </div>
        {this.renderOptions()}
      </div>
    );
  }
}
