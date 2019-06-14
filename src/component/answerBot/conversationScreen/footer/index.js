import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { InputBox } from 'component/shared/InputBox';
import { i18n } from 'service/i18n';
import {
  questionSubmitted,
  questionValueChanged,
  getInTouchClicked
} from 'src/redux/modules/answerBot/conversation/actions';
import {
  getCurrentMessage,
} from 'src/redux/modules/answerBot/root/selectors';
import { IconButton } from 'component/Icon';
import { PillButton } from 'src/component/shared/PillButton';
import { getContactButtonVisible } from 'src/redux/modules/answerBot/root/selectors';
import { SlideAppear } from 'component/transition/SlideAppear';
import {
  botUserMessage,
  botChannelChoice
} from 'src/redux/modules/answerBot/root/actions/bot';

import { ICONS } from 'constants/shared';

import { locals as styles } from './Footer.scss';
import classNames from 'classnames';
import _ from 'lodash';

class Footer extends Component {
  static propTypes = {
    currentMessage: PropTypes.string.isRequired,
    questionSubmitted: PropTypes.func.isRequired,
    getInTouchClicked: PropTypes.func.isRequired,
    scrollToBottom: PropTypes.func,
    questionValueChanged: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    showGetInTouch: PropTypes.bool.isRequired,
    botUserMessage: PropTypes.func.isRequired,
    botChannelChoice: PropTypes.func.isRequired
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
      <div>
        {this.renderGetInTouch()}
        <InputBox
          inputValue={currentMessage}
          name='answerBotInputValue'
          placeholder={placeholder}
          updateInputValue={questionValueChanged}
          handleSendInputValue={this.handleSendInputValue}
        />
      </div>
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
      <div>
        {this.renderGetInTouch()}
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
      </div>
    );
  }

  renderGetInTouch = () => {
    const containerClasses = classNames(
      styles.slideAppear,
      { [styles.slideAppearMobile]: this.props.isMobile }
    );

    return (
      <SlideAppear
        trigger={this.props.showGetInTouch}
        duration={200}
        transitionOnMount={true}
        startPosHeight={'-10px'}
        endPosHeight={'0px'}
        className={containerClasses}
      >
        <div className={styles.quickReplyContainer}>
          <PillButton
            className={styles.getInTouch}
            label={i18n.t('embeddable_framework.answerBot.button.get_in_touch')}
            onClick={this.handleGetInTouchClicked}
          />
        </div>
      </SlideAppear>
    );
  };

  handleGetInTouchClicked = () => {
    this.props.getInTouchClicked();
    this.props.botUserMessage(
      i18n.t('embeddable_framework.answerBot.button.get_in_touch')
    );
    this.props.botChannelChoice(
      i18n.t('embeddable_framework.answerBot.msg.channel_choice.get_in_touch')
    );
  };

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
    currentMessage: getCurrentMessage(state),
    showGetInTouch: getContactButtonVisible(state)
  };
};

const actionCreators = {
  questionSubmitted,
  questionValueChanged,
  getInTouchClicked,
  botUserMessage,
  botChannelChoice
};

const connectedComponent = connect(
  mapStateToProps, actionCreators, null, { withRef: true }
)(Footer);

export {
  connectedComponent as default,
  Footer as Component
};
