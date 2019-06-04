import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { InputBox } from 'component/shared/InputBox';
import { i18n } from 'service/i18n';
import { questionSubmitted, questionValueChanged } from 'src/redux/modules/answerBot/conversation/actions';
import {
  getCurrentMessage,
} from 'src/redux/modules/answerBot/root/selectors';
import { IconButton } from 'component/Icon';

import { ICONS } from 'constants/shared';

import { locals as styles } from './Footer.scss';
import _ from 'lodash';

class Footer extends Component {
  static propTypes = {
    currentMessage: PropTypes.string.isRequired,
    questionSubmitted: PropTypes.func.isRequired,
    scrollToBottom: PropTypes.func,
    questionValueChanged: PropTypes.func.isRequired,
    isMobile: PropTypes.bool
  };

  static defaultProps = {
    scrollToBottom: () => {},
    isMobile: false
  };

  handleQuestionSubmitted = (...args) => {
    this.props.questionSubmitted(...args);
    this.props.scrollToBottom(); // Scroll to visitor's question
  }

  renderDesktop = () => {
    const { currentMessage, questionValueChanged } = this.props;
    const placeholder = i18n.t('embeddable_framework.answerBot.inputBox.placeholder');

    return (
      <InputBox
        inputValue={currentMessage}
        name='answerBotInputValue'
        placeholder={placeholder}
        updateInputValue={questionValueChanged}
        handleSendInputValue={this.handleSendInputValue}
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
    const { currentMessage, questionValueChanged } = this.props;
    const placeholder = i18n.t('embeddable_framework.answerBot.inputBox.placeholder');

    return (
      <div className={styles.containerMobile}>
        <div className={styles.inputContainerMobile}>
          <InputBox
            inputValue={currentMessage}
            name='answerBotInputValue'
            placeholder={placeholder}
            updateInputValue={questionValueChanged}
            handleSendInputValue={this.handleSendInputValue}
            isMobile={true} />
        </div>
        {this.renderSend()}
      </div>
    );
  }

  renderSend = () => {
    return (
      <IconButton
        type={ICONS.SEND_CHAT}
        disableTooltip={this.props.isMobile}
        altText={i18n.t('embeddable_framework.submitTicket.form.submitButton.label.send')}
        buttonClassName={styles.button}
        className={styles.iconSendAnswerBotMobile}
        onClick={this.handleSendInputValue}
      />
    );
  }

  render = () => {
    return this.props.isMobile ? this.renderMobile() : this.renderDesktop();
  }
}

const mapStateToProps = (state) => {
  return {
    currentMessage: getCurrentMessage(state)
  };
};

const actionCreators = {
  questionSubmitted,
  questionValueChanged
};

const connectedComponent = connect(
  mapStateToProps, actionCreators, null, { withRef: true }
)(Footer);

export {
  connectedComponent as default,
  Footer as Component
};
