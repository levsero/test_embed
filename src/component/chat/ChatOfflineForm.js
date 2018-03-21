import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { i18n } from 'service/i18n';
import classNames from 'classnames';

import { ScrollContainer } from 'component/container/ScrollContainer';
import { Form } from 'component/form/Form';
import { Field } from 'component/field/Field';
import { EmailField } from 'component/field/EmailField';
import { chatOfflineFormChanged } from 'src/redux/modules/chat';
import { getChatOfflineForm,
         getOfflineFormFields } from 'src/redux/modules/chat/chat-selectors';

import { locals as styles } from './ChatOfflineForm.scss';

const mapStateToProps = (state) => {
  return {
    formState: getChatOfflineForm(state),
    formFields: getOfflineFormFields(state)
  };
};

class ChatOfflineForm extends Component {
  static propTypes = {
    updateFrameSize: PropTypes.func.isRequired,
    chatOfflineFormChanged: PropTypes.func.isRequired,
    formState: PropTypes.object.isRequired,
    formFields: PropTypes.object.isRequired,
    isMobile: PropTypes.bool
  };

  static defaultProps = {
    updateFrameSize: () => {},
    isMobile: false
  };

  renderNameField() {
    const isRequired = !!_.get(this.props.formFields, 'name.required');
    const value = _.get(this.props.formState, 'name', '');

    return (
      <Field
        name='name'
        label={i18n.t('embeddable_framework.common.textLabel.name')}
        value={value}
        required={isRequired} />
    );
  }

  renderEmailField() {
    const isRequired = !!_.get(this.props.formFields, 'email.required');
    const value = _.get(this.props.formState, 'email', '');

    return (
      <EmailField
        label={i18n.t('embeddable_framework.common.textLabel.email')}
        value={value}
        required={isRequired} />
    );
  }

  renderPhoneNumberField() {
    const isRequired = !!_.get(this.props.formFields, 'phone.required');
    const value = _.get(this.props.formState, 'phone', '');

    return (
      <Field
        key='phone'
        name='phone'
        label={i18n.t('embeddable_framework.common.textLabel.phone_number')}
        value={value}
        required={isRequired} />
    );
  }

  renderMessageField() {
    const isRequired = !!_.get(this.props.formFields, 'message.required');
    const value = _.get(this.props.formState, 'message', '');

    return (
      <Field
        key='message'
        name='message'
        label={i18n.t('embeddable_framework.common.textLabel.message')}
        input={<textarea rows='5' />}
        value={value}
        required={isRequired} />
    );
  }

  renderBody() {
    const submitbuttonText = i18n.t('embeddable_framework.chat.preChat.offline.button.sendMessage');
    const offlineGreetingText = i18n.t('embeddable_framework.chat.preChat.offline.greeting');

    return (
      <Form
        formState={this.props.formState}
        onChange={this.props.chatOfflineFormChanged}
        submitButtonClasses={styles.submitButton}
        submitButtonLabel={submitbuttonText}>
        <p className={styles.offlineGreeting}>
          {offlineGreetingText}
        </p>
        {this.renderNameField()}
        {this.renderEmailField()}
        {this.renderPhoneNumberField()}
        {this.renderMessageField()}
      </Form>
    );
  }

  render() {
    const { isMobile } = this.props;
    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: isMobile }
    );

    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <ScrollContainer
        ref='scrollContainer'
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}
        title={i18n.t('embeddable_framework.chat.title')}>
        {this.renderBody()}
      </ScrollContainer>
    );
  }
}

const actionCreators = {
  chatOfflineFormChanged
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(ChatOfflineForm);
