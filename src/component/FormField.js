/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';

import { Loading }         from 'component/Loading';
import { validation }      from 'mixin/validation';
import { formField }       from 'mixin/formField';
import { isMobileBrowser } from 'utility/devices';
import { i18n }            from 'service/i18n';

var { FieldMixin } = ReactForms,
    Property = ReactForms.schema.Property,
    isFailure = ReactForms.validation.isFailure,
    classSet = React.addons.classSet;

var FocusField = React.createClass({
  mixins: [FieldMixin, formField],

  componentWillReceiveProps() {
    var value = this.value(),
        isValid = !isFailure(value.validation);

    if (this.state.blurred && isValid) {
      this.setState({blurred: false});
    }
  },

  render() {
    var value = this.value(),
        isInvalid = isFailure(value.validation),
        classNames = classSet({
          'Arrange Arrange--middle rf-Field u-isSelectable': true,
          'rf-Field--focused': this.state.focused,
          'rf-Field--blurred': this.state.blurred,
          'rf-Field--invalid': isInvalid,
          'rf-Field--dirty': !value.isUndefined
        });

    return (
      <label className={classNames}>
        <i className={'Arrange-sizeFit u-isActionable Icon Icon--' + this.props.icon} />
        {this.transferPropsTo(this.renderInputComponent({
          onFocus: this.onFocus,
          onBlur: this.onBlur
        }))}
      </label>
    );
  }
});

function IconField(props) {
  props = props || {};

  /* jshint quotmark:false */
  return (
    <Property
      name={props.name}
      required={!!props.required}
      input={
        props.input ||
        <input
          placeholder={props.placeholder}
          autoComplete={props.autoComplete || 'on'}
          className='Arrange-sizeFill u-vsizeAll' />
      }
      validate={props.validate || ''}
      component={<FocusField icon={props.icon} />}
    />
  );
}

var SearchField = React.createClass({
  mixins: [formField],

  getInitialState() {
    return {
      searchInputVal: ''
    };
  },

  handleUpdate(e) {
    var value = e.target.value;

    if (value !== '' && isMobileBrowser()) {
      this.setState({clearInput: true});
    }

    this.setState({searchInputVal: value});
  },

  clearInput(e) {
    e.preventDefault();

    this.setState({
      searchInputVal: '',
      clearInput: false
    });

    this.focus();
  },

  getSearchField() {
    return this.refs.searchFieldInput.getDOMNode();
  },

  getValue() {
    return this.state.searchInputVal;
  },

  focus() {
    return this.getSearchField().focus();
  },

  blur() {
    return this.getSearchField().blur();
  },

  render() {
    var loadingClasses = classSet({
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
        searchInputFieldClasses = classSet({
          'Arrange-sizeFill u-paddingR u-textSizeMed': true,
          'u-textSizeBaseMobile': this.props.fullscreen,
          'u-textSizeMed': !this.props.fullscreen
        }),
        clearInputClasses = classSet({
          'Icon Icon--clearInput': true,
          'u-posAbsolute u-posEnd--flush u-posCenter--vert u-isActionable u-textCenter': true,
          'u-isHidden': !this.state.clearInput || this.props.isLoading
        });

    return (
      /* jshint quotmark:false */
      <div className={searchContainerClasses}>
        <label className={searchInputClasses}>
          <i className='Arrange-sizeFit u-isActionable Icon Icon--search'></i>
          <div className='Arrange-sizeFill u-vsizeAll u-posRelative'>
            <input
              className={searchInputFieldClasses}
              ref='searchFieldInput'
              onChange={this.handleUpdate}
              value={this.state.searchInputVal}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              placeholder={i18n.t('embeddable_framework.helpCenter.search.label')}
              type='search' />
            <Loading className={loadingClasses} />
            <div
              className={clearInputClasses}
              onClick={this.clearInput}
              onTouchEnd={this.clearInput} />
          </div>
        </label>
      </div>
    );
  }
});

function EmailField(props) {
  var type = 'email';

  return IconField({
    name: props.name || type,
    ref: props.ref || type,
    required: !!props.required,
    icon: props.icon,
    input: (
      /* jshint quotmark:false */
      <input
        type={type}
        placeholder={i18n.t('embeddable_framework.form.field.email.label')}
        className='Arrange-sizeFill u-vsizeAll' />
    ),
    validate: function(value) {
      return validation.validateEmail(value);
    }
  });
}

export { IconField, EmailField, SearchField };

