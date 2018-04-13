import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { document as doc } from 'utility/globals';
import { i18n } from 'service/i18n';
import { emailValid, chatNameDefault } from 'src/util/utils';
import { ChatPopup } from 'component/chat/ChatPopup';
import { EmailField } from 'component/field/EmailField';
import { Field } from 'component/field/Field';
import { Icon } from 'component/Icon';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { ICONS } from 'constants/shared';

import { locals as styles } from 'component/chat/ChatContactDetailsPopup.scss';

import {
  EDIT_CONTACT_DETAILS_SCREEN,
  EDIT_CONTACT_DETAILS_LOADING_SCREEN,
  EDIT_CONTACT_DETAILS_ERROR_SCREEN
} from 'constants/chat';

export class ChatContactDetailsPopup extends Component {
  static propTypes = {
    screen: PropTypes.string.isRequired,
    className: PropTypes.string,
    contactDetails: PropTypes.object,
    leftCtaFn: PropTypes.func,
    rightCtaFn: PropTypes.func,
    tryAgainFn: PropTypes.func,
    show: PropTypes.bool,
    isMobile: PropTypes.bool,
    visitor: PropTypes.object
  }

  static defaultProps = {
    className: '',
    contactDetails: {},
    leftCtaFn: () => {},
    rightCtaFn: () => {},
    tryAgainFn: () => {},
    show: false,
    isMobile: false,
    visitor: {}
  }

  constructor(props) {
    super(props);
    const email = props.contactDetails.email || _.get(props.visitor, 'email', '');
    const name = props.contactDetails.display_name || _.get(props.visitor, 'display_name', '');

    this.state = {
      valid: emailValid(email, { allowEmpty: true }),
      formState: {
        email,
        name: chatNameDefault(name) ? '' : name
      }
    };

    this.form = null;
  }

  componentWillReceiveProps(nextProps) {
    const email = nextProps.contactDetails.email || _.get(nextProps.visitor, 'email', '');
    const name = nextProps.contactDetails.display_name || _.get(nextProps.visitor, 'display_name', '');

    this.setState({
      valid: emailValid(email, { allowEmpty: true }),
      formState: {
        email,
        name: chatNameDefault(name) ? '' : name
      }
    });
  }

  handleSave = () => {
    const { name, email } = this.state.formState;

    this.props.rightCtaFn(name, email);

    if (doc.activeElement) {
      doc.activeElement.blur();
    }
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
    const inputClasses = this.props.isMobile ? styles.fieldInputMobile : '';

    return (
      <Field
        fieldContainerClasses={styles.fieldContainer}
        fieldClasses={styles.field}
        labelClasses={styles.fieldLabel}
        inputClasses={inputClasses}
        label={i18n.t('embeddable_framework.common.textLabel.name')}
        value={this.state.formState.name}
        name='name'/>
    );
  }

  renderEmailField = () => {
    const inputClasses = this.props.isMobile ? styles.fieldInputMobile : '';

    return (
      <EmailField
        fieldContainerClasses={styles.fieldContainer}
        fieldClasses={styles.field}
        labelClasses={styles.fieldLabel}
        inputClasses={inputClasses}
        label={i18n.t('embeddable_framework.common.textLabel.email')}
        value={this.state.formState.email}
        name='email'/>
    );
  }

  renderFailureScreen = () => {
    if (this.props.screen !== EDIT_CONTACT_DETAILS_ERROR_SCREEN) return null;

    const failureMessageLabel = i18n.t('embeddable_framework.common.notify.error.generic');

    return (
      <div className={styles.resultContainer}>
        <div className={styles.resultScreen}>
          <div className={styles.resultIcon}>
            <Icon type={ICONS.ERROR_FILL} />
          </div>
          <div className={styles.resultMessage}>
            {failureMessageLabel}
          </div>
        </div>
      </div>
    );
  }

  renderForm = () => {
    if (this.props.screen !== EDIT_CONTACT_DETAILS_SCREEN) return null;

    return (
      <div className={styles.popupChildrenContainer}>
        <form
          ref={(element) => this.form = element}
          className={styles.form}
          noValidate={true}
          onChange={this.handleFormChange}>
          {this.renderTitle()}
          {this.renderNameField()}
          {this.renderEmailField()}
        </form>
      </div>
    );
  }

  renderLoadingSpinner() {
    if (this.props.screen !== EDIT_CONTACT_DETAILS_LOADING_SCREEN) return null;

    return (
      <LoadingSpinner className={styles.loadingSpinner} />
    );
  }

  render = () => {
    const { isMobile, className, leftCtaFn, screen } = this.props;
    const isLoading = (screen === EDIT_CONTACT_DETAILS_LOADING_SCREEN);
    const containerClasses = (isLoading) ? styles.popupChildrenContainerLoading : '';

    return (
      <ChatPopup
        isMobile={isMobile}
        useOverlay={isMobile}
        className={className}
        containerClasses={containerClasses}
        showCta={screen === EDIT_CONTACT_DETAILS_SCREEN}
        show={this.props.show}
        leftCtaFn={leftCtaFn}
        leftCtaLabel={i18n.t('embeddable_framework.common.button.cancel')}
        rightCtaFn={this.handleSave}
        rightCtaLabel={i18n.t('embeddable_framework.common.button.save')}
        rightCtaDisabled={!this.state.valid}>
        {this.renderForm()}
        {this.renderFailureScreen()}
        {this.renderLoadingSpinner()}
      </ChatPopup>
    );
  }
}
