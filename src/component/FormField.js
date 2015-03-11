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
    CheckboxGroup = ReactForms.input.CheckboxGroup,
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
          'Arrange Arrange--middle rf-Field u-isSelectable u-posRelative': true,
          'rf-Field--focused': this.state.focused,
          'rf-Field--blurred': this.state.blurred,
          'rf-Field--invalid': isInvalid && this.state.blurred,
          'rf-Field--dirty': !value.isUndefined,
          'rf-Field--dropdown': this.props.dropdown,
          'rf-Field--mobile': isMobileBrowser(),
          'rf-Field--clean': this.props.checkbox
        }),
        iconClasses = classSet({
          'u-isHidden': !this.props.icon,
          'Arrange-sizeFit u-isActionable Icon Icon--': true
        }),
        dropdownClasses = classSet({
          'u-isHidden': !this.props.dropdown,
          'Arrange-sizeFit rf-Field__arrows': true
        });

    return (
      /* jshint quotmark: false */
      <label className={classNames}>
        <i className={iconClasses + this.props.icon} />
        {this.transferPropsTo(this.renderInputComponent({
          onFocus: this.onFocus,
          onBlur: this.onBlur
        }))}
        <div className={dropdownClasses}>
          <i className='Icon--dropdownArrow' />
          <i className='Icon--dropdownArrow Icon--dropdownArrowBottom' />
        </div>
      </label>
    );
  }
});

function IconField(props = {}) {
  var fieldClasses = classSet({
        'Arrange-sizeFill u-vsizeAll': true,
        'u-textSize15': isMobileBrowser()
      });

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
          className={fieldClasses} />
      }
      validate={props.validate || ''}
      component={<FocusField icon={props.icon} />}
    />
  );
}

function CheckboxField(props = {}) {
  /* jshint quotmark:false */
  return (
    <Property
      name={props.name}
      type='array'
      required={!!props.required}
      input={
        <CheckboxGroup
          options={[{value: '1', name: props.label}]}
        />
      }
      component={<FocusField icon={props.icon} checkbox={true} />}
    />
  );
}

function SelectField(props = {}) {
  /* jshint quotmark:false */
  var fieldClasses = classSet({
        'Arrange-sizeFill u-vsizeAll u-textSecondary': true,
        'u-textSize15': isMobileBrowser()
      }),
      options = [
        <option value='' disabled selected>{props.placeholder}</option>
      ],
      optionGroups;

  // For nested drop down fields, we group into key value objects with category
  // and values
  optionGroups = _.groupBy(props.options, function(option) {
    /* jshint laxbreak: true */
    return (option.title.indexOf('::') > 0)
         ? option.title.split('::', 1)
         : '';
  });

  _.forEach(optionGroups, function(group, key) {
    var nestedOptions;

    // if not a nested field
    if (_.isEmpty(key)) {
      _.forEach(group, function(option) {
        options.push(
          <option value={option.value}>{option.title}</option>
        );
      });
    } else {
      nestedOptions = _.map(group, function(nestedOption) {
        var title = nestedOption.title.split('::')[1];
        return <option value={nestedOption.value}>{title}</option>;
      });

      options.push(
        <optgroup label={key}>
          {nestedOptions}
        </optgroup>
      );
    }
  });

  /* jshint quotmark:false */
  return (
    <Property
      name={props.name}
      required={!!props.required}
      input={
        <select
          name={props.name}
          className={fieldClasses}>
          {options}
        </select>
      }
      component={<FocusField dropdown={true} />}
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

    if (this.props.onUpdate) {
      this.props.onUpdate(value);
    }
  },

  clearInput() {
    this.setState({
      searchInputVal: '',
      isClearable: false
    });

    if (this.props.onUpdate) {
      this.props.onUpdate('');
    }
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
    /* jshint laxbreak:true */
    var loadingClasses = classSet({
          'u-isHidden': !this.props.isLoading
        }),
        searchContainerClasses = classSet({
          'u-cf': true,
          'Form-cta--bar': this.props.hasSearched && !this.props.fullscreen,
          'u-paddingHN u-paddingBN Form-cta--barFullscreen': this.props.fullscreen,
          'u-marginTM': this.props.hasSearched && this.props.fullscreen,
          'Form-cta Container-pullout': !this.props.fullscreen
        }),
        searchInputClasses = classSet({
          'Arrange Arrange--middle rf-Field rf-Field--search u-isSelectable': true,
          'rf-Field--focused': this.state.focused
        }),
        searchInputFieldClasses = classSet({
          'Arrange-sizeFill u-paddingR Form-placeholder u-textSizeMed': true,
          'u-textSizeBaseMobile': this.props.fullscreen
        }),
        searchInputFieldIconClasses = classSet({
          'Arrange-sizeFit u-isActionable Icon Icon--search': true,
          'u-userTextColor': this.state.focused
        }),
        clearInputClasses = classSet({
          'Icon Icon--clearInput': true,
          'u-isActionable u-textCenter': true,
          'u-isHidden': !this.state.isClearable || this.props.isLoading
        }),
        placeholder = (isMobileBrowser())
                    ? ''
                    : i18n.t('embeddable_framework.helpCenter.search.label');

    return (
      /* jshint quotmark:false */
      <div className={searchContainerClasses}>
        <div className={searchInputClasses}>
          <i
            className={searchInputFieldIconClasses}
            onClick={this.props.onSearchIconClick} />
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

function EmailField(props = {}) {
  var type = 'email',
      fieldClasses = classSet({
        'Arrange-sizeFill u-vsizeAll': true,
        'u-textSize15': isMobileBrowser()
      });

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
        className={fieldClasses} />
    ),
    validate: function(value) {
      return validation.validateEmail(value);
    }
  });
}

export { IconField, CheckboxField, EmailField, SearchField, SelectField };

