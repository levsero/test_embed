import React from 'react/addons';
import _     from 'lodash';

import { Button }          from 'component/Button';
import { i18n }            from 'service/i18n';
import { Field,
         getCustomFields } from 'component/FormField';

const classSet = React.addons.classSet;

export const SubmitTicketForm = React.createClass({
  getInitialState() {
    return {
      isValid: false,
      buttonMessage: i18n.t('embeddable_framework.submitTicket.form.submitButton.label.send'),
      isSubmitting: false,
      isRTL: i18n.isRTL(),
      removeTicketForm: false,
      formState: {}
    };
  },

  getDefaultProps() {
    return {
      fullscreen: false
    };
  },

  componentDidUpdate() {
    if(this.refs.formWrapper && this.state.formState) {
      const form = this.refs.form.getDOMNode();

      _.chain(form.elements)
        .filter((field) => field.type !== 'submit')
        .forEach((field) => {
          if(this.state.formState[field.name]) {
            if(field.type === 'checkbox') {
              // Based on formState set checked property
              field.checked = !!this.state.formState[field.name];
            } else {
              field.value = this.state.formState[field.name];
            }
          } else {
            // If clearing form after submit we need to make sure
            // formState clears out undefined values
            field.value = '';
            // Don't need to check for type here as non checkbox inputs
            // will ignore this property.
            field.checked = false;
          }
      });
    }
  },

  resetTicketFormVisibility() {
    // if the user closes and reopens, we need to
    // re-render the search field
    this.setState({
      removeTicketForm: false
    });
  },

  focusField() {
    const form = this.refs.form.getDOMNode(),
          // Focus on the first empty text or textarea
          element = _.find(form.querySelectorAll('input, textarea'), function(input) {
            return input.value === '' && _.contains(['text', 'textarea', 'email'], input.type);
          });

    if (element) {
      element.focus();
    }
  },

  hideVirtualKeyboard() {
    this.setState({
      removeTicketForm: true
    });
  },

  handleSubmit(e) {
    const isFormValid = this.state.isValid;

    if (isFormValid) {
      this.setState({
        buttonMessage: i18n.t('embeddable_framework.submitTicket.form.submitButton.label.sending'),
        isSubmitting: true
      });
    }

    this.props.submit(e, {
      isFormValid: isFormValid,
      value: this.formState()
    });
  },

  formState() {
    const form = this.refs.form.getDOMNode(),
          formState = _.chain(form.elements)
            .filter((field) => field.type !== 'submit')
            .reduce((result, field) => {
              if(field.type === 'checkbox') {
                result[field.name] = field.checked ? 1 : 0;
              } else {
                result[field.name] = field.value;
              }

              return result;
            },
            {}).value();

    return formState;
  },

  handleUpdate() {
    const form = this.refs.form.getDOMNode();

    this.setState({
      formState: this.formState(),
      isValid: form.checkValidity()
    });
  },

  render() {
    /* jshint quotmark:false */
    var formClasses = classSet({
          'Form u-cf': true,
          'Form--fullscreen': this.props.fullscreen,
          'u-isHidden': this.props.hide
        }),
        titleClasses = classSet({
          'u-textSizeMed u-textBold u-extSizeMed u-textCenter': true,
          'Form-ctaLegend u-posAbsolute u-posCenter': !this.props.fullscreen,
          'u-textSizeBaseMobile': this.props.fullscreen
        }),
        barClasses = classSet({
          'Form-cta u-cf Container-pullout u-paddingBS': true,
          'Form-cta--bar u-marginBM u-paddingBL': !this.props.fullscreen
        });

    const customFields = getCustomFields(this.props.customFields, this.state.formState);

    return (
      <form
        noValidate
        onSubmit={this.handleSubmit}
        onChange={this.handleUpdate}
        ref='form'
        className={formClasses}>
        <div className={barClasses}>
          <h2 className={titleClasses}>
            {i18n.t('embeddable_framework.submitTicket.form.title')}
          </h2>
        </div>
        {
          !this.state.removeTicketForm &&
          <div ref='formWrapper'>
            <Field
              placeholder={i18n.t('embeddable_framework.submitTicket.field.name.label')}
              icon='avatar'
              value={this.state.formState.name}
              name='name' />
            <Field
              placeholder={i18n.t('embeddable_framework.form.field.email.label')}
              type='email'
              icon='mail'
              required
              value={this.state.formState.email}
              name='email' />
            {customFields.fields}
            <Field
              placeholder={i18n.t('embeddable_framework.submitTicket.field.description.label')}
              required
              icon='msg'
              value={this.state.formState.description}
              name='description'
              input={
                <textarea rows='5' />
              }
            />
            {customFields.checkboxes}
            {this.props.children}
          </div>
        }
        <Button
          label={this.state.buttonMessage}
          disabled={!this.state.isValid || this.state.isSubmitting}
          fullscreen={this.props.fullscreen}
          type='submit'
          rtl={i18n.isRTL()}
        />
      </form>
    );
  }
});
