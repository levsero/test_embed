/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';

import { helpCenterSchema } from 'component/HelpCenterSchema';
import { i18n }             from 'service/i18n';

require('imports?_=lodash!lodash');

var classSet = React.addons.classSet,
    HelpCenterFormBody = ReactForms.Form,
    isFailure = ReactForms.validation.isFailure;

var HelpCenterForm = React.createClass({
  getInitialState() {
    return {
      isValid: false,
      buttonMessage: 'Send',
      isSubmitting: false
    };
  },

  getDefaultProps() {
    return {
      fullscreen: false
    };
  },

  handleSubmit(e) {
    var form = this.refs.helpCenterForm,
        formValue = form.value(),
        isFormInvalid = isFailure(formValue.validation);

    this.props.submit(e, {
      isFormInvalid: isFormInvalid,
      value: formValue.value
    });
  },

  handleUpdate(values, isValid) {
    this.setState({isValid: isValid});
    this.props.onSearch(values.helpCenterForm)
  },

  render() {
    /* jshint quotmark:false */
    var formBody = this.transferPropsTo(
          <HelpCenterFormBody
            ref='helpCenterForm'
            schema={helpCenterSchema}
            className='Form-cta'
            onUpdate={this.handleUpdate}
            component={React.DOM.div} />
        ),
        buttonClasses = classSet({
          'Button Button--cta Anim-color u-textNoWrap': true,
          'u-pullRight': !this.props.fullscreen,
          'u-sizeFull': this.props.fullscreen
        });

    return (
      <form
        noValidate
        onSubmit={this.handleSubmit}
        className={'Form u-cf'}>
        {formBody}
        <div class="Form-cta Container-pullout u-nbfc">

        </div>
        {this.props.children}
        <input
          type='submit'
          value={i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket')}
          ref='submitButton'
          className={buttonClasses}
        />
      </form>
    );
  }
});

export { HelpCenterForm };

