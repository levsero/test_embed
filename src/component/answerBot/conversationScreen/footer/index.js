import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { InputBox } from 'component/shared/InputBox';
import { i18n } from 'service/i18n';
import { questionSubmitted, questionValueChanged } from 'src/redux/modules/answerBot/conversation/actions';
import { botMessage } from 'src/redux/modules/answerBot/root/actions/bot';
import {
  getCurrentMessage,
  isInputDisabled
} from 'src/redux/modules/answerBot/root/selectors';
import { IconButton } from 'component/Icon';

import { ICONS } from 'constants/shared';

import { locals as styles } from './Footer.scss';
import _ from 'lodash';
import classNames from 'classnames';

class Footer extends Component {
  static propTypes = {
    currentMessage: PropTypes.string.isRequired,
    questionSubmitted: PropTypes.func.isRequired,
    scrollToBottom: PropTypes.func,
    questionValueChanged: PropTypes.func.isRequired,
    botMessage: PropTypes.func.isRequired,
    inputDisabled: PropTypes.bool,
    isMobile: PropTypes.bool
  };

  static defaultProps = {
    inputDisabled: false,
    scrollToBottom: () => {},
    isMobile: false
  };

  handleQuestionSubmitted = (...args) => {
    this.props.questionSubmitted(...args);
    this.props.botMessage(
      i18n.t('embeddable_framework.answerBot.results.pending')
    );
    this.props.scrollToBottom(); // Scroll to visitor's question
  }

  renderDesktop = () => {
    const { currentMessage, inputDisabled, questionValueChanged } = this.props;
    const placeholder = i18n.t('embeddable_framework.answerBot.inputBox.placeholder');

    return (
      <InputBox
        inputValue={currentMessage}
        name='answerBotInputValue'
        placeholder={placeholder}
        updateInputValue={questionValueChanged}
        handleSendInputValue={this.handleSendInputValue}
        disabled={inputDisabled}
      />
    );
  };

  handleSendInputValue = () => {
    const { currentMessage } = this.props;

    if (_.isEmpty(currentMessage)) return;

    this.handleQuestionSubmitted(currentMessage);
    this.props.questionValueChanged('');
  }

  renderMobile = () => {
    const { currentMessage, inputDisabled, questionValueChanged } = this.props;
    const placeholder = i18n.t('embeddable_framework.answerBot.inputBox.placeholder');

    return (
      <div className={styles.containerMobile}>
        <div className={styles.inputContainerMobile}>
          <InputBox
            inputValue={currentMessage}
            name='answerBotInputValue'
            placeholder={placeholder}
            updateInputValue={questionValueChanged}
            disabled={inputDisabled}
            handleSendInputValue={this.handleSendInputValue}
            isMobile={true} />
        </div>
        {this.renderSend()}
      </div>
    );
  }

  renderSend = () => {
    const buttonClasses = classNames(styles.button, {
      [styles.disabledSend]: this.props.inputDisabled
    });

    return (
      <IconButton
        type={ICONS.SEND_CHAT}
        disableTooltip={this.props.isMobile}
        altText={i18n.t('embeddable_framework.submitTicket.form.submitButton.label.send')}
        buttonClassName={buttonClasses}
        className={styles.iconSendAnswerBotMobile}
        onClick={this.handleSendInputValue}
        disabled={this.props.inputDisabled} />
    );
  }

  render = () => {
    return this.props.isMobile ? this.renderMobile() : this.renderDesktop();
  }
}

const mapStateToProps = (state) => {
  return {
    currentMessage: getCurrentMessage(state),
    inputDisabled: isInputDisabled(state)
  };
};

const actionCreators = {
  questionSubmitted,
  questionValueChanged,
  botMessage
};

const connectedComponent = connect(
  mapStateToProps, actionCreators, null, { withRef: true }
)(Footer);

export {
  connectedComponent as default,
  Footer as PureFooter
};
