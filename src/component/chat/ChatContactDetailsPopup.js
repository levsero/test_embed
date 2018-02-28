import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChatPopup } from 'component/chat/ChatPopup';
import { Field } from 'component/field/Field';
import { i18n } from 'service/i18n';

import { locals as styles } from 'component/chat/ChatContactDetailsPopup.scss';

export class ChatContactDetailsPopup extends Component {
  static propTypes = {
    className: PropTypes.string,
    leftCtaFn: PropTypes.func,
    rightCtaFn: PropTypes.func
  }

  static defaultProps = {
    className: '',
    leftCtaFn: () => {},
    rightCtaFn: () => {}
  }

  constructor() {
    super();

    this.state = {
      valid: false,
      formState: {}
    };

    this.form = null;
  }

  handleSave = () => {
    const { name, email } = this.state.formState;

    this.props.rightCtaFn(name, email);
  }

  handleFormChange = (e) => {
    const { name, value } = e.target;
    const fieldState = { [name]: value };

    this.setState({
      valid: this.form.checkValidity(),
      formState: { ...this.state.formState, ...fieldState }
    });
  }

  renderTitle = () => {
    const title = i18n.t('embeddable_framework.chat.options.editContactDetails');

    return <h4 className={styles.title}>{title}</h4>;
  }

  renderNameField = () => {
    return (
      <Field
        fieldContainerClasses={styles.fieldContainer}
        fieldClasses={styles.field}
        placeholder={i18n.t('embeddable_framework.common.textLabel.name')}
        required={true}
        value={this.state.formState.name}
        name='name'/>
    );
  }

  renderEmailField = () => {
    return (
      <Field
        fieldContainerClasses={styles.fieldContainer}
        fieldClasses={styles.field}
        placeholder={i18n.t('embeddable_framework.common.textLabel.email')}
        required={true}
        value={this.state.formState.email}
        pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" // eslint-disable-line
        name='email' />
    );
  }

  renderForm = () => {
    return (
      <form
        ref={(element) => this.form = element}
        className={styles.form}
        noValidate={true}
        onChange={this.handleFormChange}>
        {this.renderTitle()}
        {this.renderNameField()}
        {this.renderEmailField()}
      </form>
    );
  }

  render = () => {
    const { className, leftCtaFn } = this.props;

    return (
      <ChatPopup
        className={className}
        childrenContainerClasses={styles.popupChildrenContainer}
        leftCtaFn={leftCtaFn}
        leftCtaLabel={i18n.t('embeddable_framework.common.button.cancel')}
        rightCtaFn={this.handleSave}
        rightCtaLabel={i18n.t('embeddable_framework.common.button.save')}
        rightCtaDisabled={!this.state.valid}>
        <div className={styles.popupChildrenContainer}>
          {this.renderForm()}
        </div>
      </ChatPopup>
    );
  }
}
