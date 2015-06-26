import React from 'react/addons';
import _     from 'lodash';

import { Button,
         ButtonSecondary,
         ButtonGroup }     from 'component/Button';
import { ScrollContainer } from 'component/ScrollContainer';
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
      fullscreen: false,
      cancelButtonMessage: i18n.t('embeddable_framework.submitTicket.form.cancelButton.label.cancel', // jshint ignore:line
        {fallback: 'Cancel'})
    };
  },

  componentDidUpdate() {
    if (this.refs.formWrapper && this.state.formState && this.state.removeTicketForm) {
      const form = this.refs.form.getDOMNode();

      _.forEach(form.elements, function(field) {
        if(field.type === 'submit') {
          return;
        }

        if (this.state.formState[field.name]) {
          if (field.type === 'checkbox') {
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
      }, this);
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

  failedToSubmit() {
    this.setState({
      isSubmitting: false,
      buttonMessage: this.getInitialState().buttonMessage
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
      value: this.getFormState()
    });
  },

  getFormState() {
    const form = this.refs.form.getDOMNode();

    return _.chain(form.elements)
      .reject((field) => field.type === 'submit')
      .reduce((result, field) => {
        /* jshint laxbreak: true */
        result[field.name] = (field.type === 'checkbox')
                           ? field.checked ? 1 : 0
                           : field.value;

        return result;
      },
      {}).value();
  },

  handleUpdate() {
    const form = this.refs.form.getDOMNode();

    this.setState({
      formState: this.getFormState(),
      isValid: form.checkValidity()
    });
  },

  render() {
    var formClasses = classSet({
          'Form u-cf': true,
          'Form--fullscreen': this.props.fullscreen,
          'u-isHidden': this.props.hide
        }),
        titleClasses = classSet({
          'u-textSizeMed u-textBold u-extSizeMed u-textCenter': true,
          'Form-ctaLegend u-posAbsolute u-posCenter': !this.props.fullscreen,
          'u-textSizeBaseMobile': this.props.fullscreen
        });
      var customFields = getCustomFields(this.props.customFields, this.state.formState),
          /* jshint laxbreak: true */
          formBody = (this.state.removeTicketForm)
                   ? null
                   : <div ref='formWrapper'>
                       <Field
                         placeholder={i18n.t('embeddable_framework.submitTicket.field.name.label')}
                         value={this.state.formState.name}
                         name='name' />
                       <Field
                         placeholder={i18n.t('embeddable_framework.form.field.email.label')}
                         type='email'
                         required
                         value={this.state.formState.email}
                         name='email' />
                       {customFields.fields}
                       <Field
                         placeholder={
                           i18n.t('embeddable_framework.submitTicket.field.description.label')
                         }
                         required
                         value={this.state.formState.description}
                         name='description'
                         input={<textarea rows='5' />}
                       />
                       {customFields.checkboxes}
                       {this.props.children}
                     </div>,
          buttonCancel = (this.props.fullscreen)
                       ? null
                       : <ButtonSecondary
                           label={this.props.cancelButtonMessage}
                           onClick={this.props.onCancel}
                           fullscreen={this.props.fullscreen} />;

    return (
      <form
        noValidate
        onSubmit={this.handleSubmit}
        onChange={this.handleUpdate}
        ref='form'
        className={formClasses}
      >
        <ScrollContainer
          header={i18n.t('embeddable_framework.submitTicket.form.title')}
          children={formBody}
          footer={
            <ButtonGroup rtl={i18n.isRTL()}>
              {buttonCancel}
              <Button
                fullscreen={this.props.fullscreen}
                label={this.state.buttonMessage}
                disabled={!this.state.isValid || this.state.isSubmitting}
                type='submit' />
            </ButtonGroup>
          }
        />
      </form>
    );
  }
});
