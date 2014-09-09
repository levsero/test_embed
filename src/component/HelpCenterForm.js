/** @jsx React.DOM */

module React from 'react/addons';

import { Loading } from 'component/Loading';
import { i18n }    from 'service/i18n';

require('imports?_=lodash!lodash');

var classSet = React.addons.classSet;

var HelpCenterForm = React.createClass({
  getInitialState() {
    return {
      isValid: false,
      buttonLabel: i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket'),
      isSubmitting: false,
      focused: false,
      searchInputVal: ''
    };
  },

  getDefaultProps() {
    return {
      fullscreen: false
    };
  },

  onFocus() {
    this.setState({
      focused: true
    });
  },

  onBlur() {
    this.setState({
      focused: false
    });
  },

  handleSubmit(e) {
    var formValue = this.state.searchInputVal;

    this.props.submit(e, {
      value: formValue
    });
  },

  handleUpdate(e) {
    var value = e.target.value;

    if (value !== '') {
      this.setState({clearInput: true});
    }

    this.setState({searchInputVal: value});
    this.props.onSearch(value);
  },

  clearInput(e) {
    e.preventDefault();

    this.setState({
      searchInputVal: '',
      clearInput: false
    });

    this.refs.helpCenterSearchField.getDOMNode().focus();
  },

  onClick() {
    this.props.onButtonClick();
  },

  render() {
    /* jshint quotmark:false */
    var buttonClasses = classSet({
          'Button Button--cta Anim-color u-textNoWrap u-textSizeSml': true,
          'u-pullRight': !this.props.fullscreen,
          'u-sizeFull': this.props.fullscreen
        }),
        buttonContainerClasses = classSet({
          'u-borderTop u-marginTA u-paddingTM': this.props.fullscreen
        }),
        formClasses = classSet({
          'Form u-cf': true,
          'Form--fullscreen': this.props.fullscreen
        }),
        loadingClasses = classSet({
          'u-posAbsolute u-posEnd--flush u-posCenter--vert': true,
          'u-isHidden': !this.props.isLoading
        }),
        searchContainerClasses = classSet({
          'Form-cta u-nbfc': true,
          'Form-cta--fullscreen u-paddingHN u-paddingBN': this.props.fullscreen,
          'Container-pullout': !this.props.fullscreen
        }),
        searchInputClasses = classSet({
          'Arrange Arrange--middle rf-Field rf-Field--search u-isSelectable': true,
          'rf-Field--focused': this.state.focused
        }),
        clearInputClasses = classSet({
          'Icon Icon--clearInput': true,
          'u-posAbsolute u-posEnd--flush u-posCenter--vert u-isActionable u-textCenter': true,
          'u-isHidden': !this.state.clearInput || this.props.isLoading
        })

    return (
      <form
        noValidate
        onSubmit={this.handleSubmit}
        className={formClasses}>
        <div className={searchContainerClasses}>
          <label className={searchInputClasses}>
            <i className='Arrange-sizeFit u-isActionable Icon Icon--search'></i>
            <div className='Arrange-sizeFill u-vsizeAll u-posRelative'>
              <input
                className='Arrange-sizeFill u-paddingR u-textSizeMed'
                ref='helpCenterSearchField'
                onChange={this.handleUpdate}
                value={this.state.searchInputVal}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                placeholder={i18n.t('embeddable_framework.helpCenter.search.label')}
                type='search' />
              <Loading className={loadingClasses} />
              <div className={clearInputClasses} onClick={this.clearInput} onTouchEnd={this.clearInput} />
            </div>
          </label>
        </div>
        {this.props.children}
        <div className={buttonContainerClasses}>
          <input
            type='button'
            value={this.state.buttonLabel}
            ref='submitButton'
            onClick={this.onClick}
            className={buttonClasses}
          />
        </div>
      </form>
    );
  }
});

export { HelpCenterForm };

