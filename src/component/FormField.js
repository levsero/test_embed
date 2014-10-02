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
          'rf-Field--invalid': isInvalid && this.state.blurred,
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
      searchInputVal: '',
      isClearable: false
    };
  },

  handleUpdate(e) {
    var value = e.target.value;

    this.setState({
      isClearable: (value !== '' && isMobileBrowser()),
      searchInputVal: value
    });
  },

  clearInput() {
    this.setState({
      searchInputVal: '',
      isClearable: false
    });
  },

  getSearchField() {
    return this.refs.searchFieldInput.getDOMNode();
  },

  getValue() {
    return this.getSearchField().value;
  },

  focus() {
    return this.getSearchField().focus();
  },

  blur() {
    return this.getSearchField().blur();
  },

  render() {
    var loadingClasses = classSet({
          'u-isHidden': !this.props.isLoading
        }),
        searchContainerClasses = classSet({
          'Form-cta u-cf': true,
          'Form-cta--bar': this.props.hasSearched && !this.props.fullscreen,
          'u-paddingHN u-paddingBN': this.props.fullscreen,
          'Container-pullout': !this.props.fullscreen
        }),
        searchInputClasses = classSet({
          'Arrange Arrange--middle rf-Field rf-Field--search u-isSelectable': true,
          'rf-Field--focused': this.state.focused
        }),
        searchInputFieldClasses = classSet({
          'Arrange-sizeFill u-paddingR Form-placeholder u-textSizeMed': true,
          'u-textSizeBaseMobile': this.props.fullscreen
        }),
        clearInputClasses = classSet({
          'Icon Icon--clearInput': true,
          'u-isActionable u-textCenter': true,
          'u-isHidden': !this.state.isClearable || this.props.isLoading || !this.state.focused
        }),
        placeholder;

    placeholder = (isMobileBrowser) ? '' : i18n.t('embeddable_framework.helpCenter.search.label');

    return (
      /* jshint quotmark:false */
      <div className={searchContainerClasses}>
        <div className={searchInputClasses}>
          <i className='Arrange-sizeFit u-isActionable Icon Icon--search'></i>
          <div className='Arrange-sizeFill u-vsizeAll u-posRelative'>
            <input
              className={searchInputFieldClasses}
              ref='searchFieldInput'
              onChange={this.handleUpdate}
              value={this.state.searchInputVal}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              placeholder={placeholder}
              type='search' />
          </div>
          <div className='Arrange-sizeFit u-isActionable'>
            <Loading className={loadingClasses} />
            <div
              onClick={this.clearInput}
              className={clearInputClasses} />
          </div>
        </div>
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

