/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';

import { Loading }          from 'component/Loading';
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
    var formValue = this.refs.helpCenterSearchField.state.value;

    this.props.submit(e, {
      value: formValue
    });
  },

  handleUpdate(e) {
    this.props.onSearch(e.target.value)
  },

  render() {
    /* jshint quotmark:false */
    var buttonClasses = classSet({
          'Button Button--cta Anim-color u-textNoWrap': true,
          'u-pullRight': !this.props.fullscreen,
          'u-sizeFull': this.props.fullscreen
        }),
        loadingClasses = classSet({
          'u-posAbsolute u-posEnd--flush u-posCenter--vert': true,
          'u-isHidden': !this.props.isLoading
        })

    return (
      <form
        noValidate
        onSubmit={this.handleSubmit}
        className='Form u-cf'>
        <div className="Form-cta Container-pullout u-nbfc">
          <label className='Arrange Arrange--middle rf-Field u-isSelectable'>
            <i className="Arrange-sizeFit u-isActionable Icon Icon--search"></i>
            <div className="Arrange-sizeFill u-vsizeAll u-posRelative">
              <input
                className="Arrange-sizeFill u-paddingR"
                ref='helpCenterSearchField'
                onChange={this.handleUpdate}
                placeholder={i18n.t('embeddable_framework.helpCenter.search.label')}
                type="text" />
              <Loading className={loadingClasses} />
            </div>
          </label>
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

