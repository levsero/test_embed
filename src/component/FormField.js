import React from 'react/addons';
import _     from 'lodash';

import { LoadingEllipses }  from 'component/Loading';
import { isMobileBrowser } from 'utility/devices';
import { i18n }            from 'service/i18n';
import { Icon }            from 'component/Icon';

const classSet = React.addons.classSet;
const geti18nContent = function(field) {
  const title = _.find(field.variants, function(variant) {
    return variant.localeId === i18n.getLocaleId();
  });

  return title ? title.content : field.title;
};
const getCustomFields = function(customFields, formState) {
  const isCheckbox = (field) => field.props.type === 'checkbox';
  const fields = _.map(customFields, function(field) {
    const sharedProps = {
      name: field.id,
      value: formState[field.id],
      required: field.required,
      placeholder: field.title,
      key: field.title
    };

    if (field.variants) {
      sharedProps.placeholder = geti18nContent(field);
    }

    switch (field.type) {
    case 'text':
      return <Field {...sharedProps} />;
    case 'tagger':
      _.forEach(field.options, function(option) {
        if (option.variants) {
          option.title = geti18nContent(option);
        }
      });
      return <SelectField {...sharedProps} options={field.options} />;
    case 'integer':
      return <Field {...sharedProps} pattern='\d+' />;
    case 'decimal':
      return <Field {...sharedProps} pattern='\d*([.,]\d+)?' />;
    case 'textarea':
      return <Field {...sharedProps} input={<textarea rows='5' />} />;
    case 'checkbox':
      return <Field {...sharedProps} label={field.title} type='checkbox' />;
    }
  });

  return {
    fields: _.reject(fields, isCheckbox),
    checkboxes: _.filter(fields, isCheckbox)
  };
};

const Field = React.createClass({
  propTypes: {
    name: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]).isRequired,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    input: React.PropTypes.element,
    required: React.PropTypes.bool,
    label: function(props, propName, componentName) {
      if (props.type === 'checkbox' && !props[propName]) {
        return new Error(`${componentName} must have a label prop if type is set to "checkbox"`);
      }
    },
    type: React.PropTypes.string,
    options: React.PropTypes.bool,
    hasSearched: React.PropTypes.bool,
    labelClasses: React.PropTypes.string,
    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      placeholder: '',
      value: '',
      input: null,
      required: false,
      type: '',
      options: false,
      hasSearched: false,
      labelClasses: '',
      onFocus: () => {},
      onBlur: () => {},
      onChange: () => {}
    };
  },

  getInitialState() {
    return {
      focused: false,
      blurred: false,
      hasError: false,
      dirty: false,
      value: this.props.value
    };
  },

  onFocus(e) {
    this.setState({
      focused: true
    });

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  },

  onBlur(e) {
    const result = this.refs.field.getDOMNode();

    this.setState({
      focused: false,
      blurred: true,
      hasError: !result.validity.valid,
      dirty: !this.state.value
    });

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  },

  onChange(e) {
    const value = e.target.value;
    const result = this.refs.field.getDOMNode();

    this.setState({
      value: value,
      hasError: !result.validity.valid
    });

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  },

  render() {
    const type = this.props.type;
    const isCheckbox = (type === 'checkbox');
    const fieldClasses = classSet({
      'Form-field u-isSelectable u-posRelative': true,
      'Form-field--invalid': this.state.hasError && this.state.blurred && !isCheckbox,
      'Form-field--focused': this.state.focused && !isCheckbox,
      'Form-field--dropdown': this.props.options,
      'Form-field--clean': isCheckbox,
      'is-mobile': isMobileBrowser()
    });
    const fieldLabelClasses = classSet({
      'Form-fieldLabel u-textXHeight': true,
      'u-textSize15': isMobileBrowser(),
      [this.props.labelClasses]: true
    });
    const fieldInputClasses = classSet({
      'Form-checkboxInput u-isHiddenVisually': isCheckbox,
      'Form-checkboxInput--focused': this.state.focused && isCheckbox,
      'Form-checkboxInput--invalid': this.state.hasError && this.state.blurred && isCheckbox,
      'u-textSizeBaseMobile': isMobileBrowser()
    });
    const dropdownClasses = classSet({
      'u-isHidden': !this.props.options,
      'Form-fieldArrows': true
    });
    const sharedProps = {
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      ref: 'field',
      value: this.props.value
    };
    const fieldProps = {
      name: this.props.name,
      value: this.props.value,
      required: this.props.required,
      label: this.props.label,
      type: this.props.type
    };

    return (
      <label className='Form-fieldContainer u-block'>
        <div className={fieldLabelClasses}>
          {isCheckbox ? '' : this.props.placeholder}
          {this.props.required && !isCheckbox ? '*' : ''}
        </div>
        <div className={fieldClasses}>
          {
            (this.props.input)
              ? React.addons.cloneWithProps(
                  this.props.input,
                _.extend({}, sharedProps, fieldProps, {className: fieldInputClasses})
                )
              : <input {...sharedProps} {...fieldProps} className={fieldInputClasses} />
          }
          {
          (isCheckbox)
            ? <div className='Form-checkbox u-pullLeft u-posRelative u-isActionable'>
                <Icon type='Icon--check' />
              </div>
            : null
          }
          {
            (this.props.label)
              ? <span className='Form-checkboxCaption u-nbfc u-isActionable u-block'>
                {this.props.label}{isCheckbox && this.props.required ? '*' : ''}
                </span>
              : null
          }
          <div className={dropdownClasses}>
            <i className='Icon--dropdownArrow' />
            <i className='Icon--dropdownArrow Icon--dropdownArrowBottom' />
          </div>
        </div>
      </label>
    );
  }
});

const SelectField = React.createClass({
  propTypes: {
    name: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]).isRequired,
    options: React.PropTypes.array.isRequired,
    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      onFocus: () => {},
      onBlur: () => {}
    };
  },

  formatOptions() {
    const props = this.props;
    const options = [
      <option value='' key={props.placeholder}>{props.placeholder}</option>
    ];

    const optionGroups = _.groupBy(props.options, function(option) {
      return (option.title.indexOf('::') !== -1)
           ? option.title.split('::')[0]
           : '';
    });

    _.forEach(optionGroups, function(group, key) {
      let nestedOptions;

      // if not a nested field
      if (_.isEmpty(key)) {
        _.forEach(group, function(option) {
          options.push(
            <option value={option.value} key={option.title}>{option.title}</option>
          );
        });
      } else {
        nestedOptions = _.map(group, function(nestedOption) {
          const title = nestedOption.title.split('::')[1];

          return <option value={nestedOption.value} key={title}>{title}</option>;
        });

        options.push(
          <optgroup label={key} key={key}>
            {nestedOptions}
          </optgroup>
        );
      }
    });

    return options;
  },

  render() {
    return (
      <Field
        {...this.props}
        input={<select>{this.formatOptions()}</select>} />
    );
  }
});

const SearchFieldButton = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    onTouch: React.PropTypes.func,
    searchTerm: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      onClick: () => {},
      onTouch: () => {},
      searchTerm: ''
    };
  },

  render() {
    return (
      <div className='u-cf u-paddingHN u-paddingBN Form-cta--barFullscreen'>
        <div
          className='Arrange Arrange--middle Form-field Form-field--search u-isSelectable is-mobile'
          onClick={this.props.onClick}
          onTouch={this.props.onTouch}>
          <Icon
            className='Arrange-sizeFit u-isActionable'
            type='Icon--search' />
          <span className='Arrange-sizeFit u-textSizeBaseMobile u-hsizeAll u-textBody'>{this.props.searchTerm}</span>
        </div>
      </div>
    );
  }
});

const SearchField = React.createClass({
  propTypes: {
    fullscreen: React.PropTypes.bool,
    isLoading: React.PropTypes.bool,
    hasSearched: React.PropTypes.bool,
    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onSearchIconClick: React.PropTypes.func,
    onChangeValue: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      fullscreen: false,
      isLoading: false,
      hasSearched: false,
      onFocus: () => {},
      onBlur: () => {},
      onChange: () => {},
      onSearchIconClick:  () => {},
      onChangeValue: () => {}
    };
  },

  getInitialState() {
    return {
      focused: false,
      blurred: false,
      searchInputVal: ''
    };
  },

  onFocus(e) {
    this.setState({
      focused: true
    });

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  },

  onBlur(e) {
    this.setState({
      focused: false,
      blurred: true
    });

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  },

  onChange(e) {
    const value = e.target.value;

    this.setState({
      searchInputVal: value
    });

    if (this.props.onChange) {
      this.props.onChange(e);
    }

    if (this.props.onChangeValue) {
      this.props.onChangeValue(value);
    }
  },

  clearInput() {
    this.setState({
      searchInputVal: ''
    });

    if (this.props.onChangeValue) {
      this.props.onChangeValue('');
    }
  },

  getSearchField() {
    return React.findDOMNode(this.refs.searchFieldInput);
  },

  getValue() {
    return this.state.searchInputVal;
  },

  focus() {
    this.getSearchField().focus();
  },

  blur() {
    this.getSearchField().blur();
  },

  render() {
    const loadingClasses = classSet({
      'u-isHidden': !this.props.isLoading
    });
    const searchContainerClasses = classSet({
      'u-cf': true,
      'u-paddingTM': this.props.hasSearched,
      'u-marginBL': !this.props.hasSearched,
      'u-paddingHN u-paddingBN Form-cta--barFullscreen': this.props.fullscreen
    });
    const searchInputClasses = classSet({
      'Arrange Arrange--middle Form-field Form-field--search u-isSelectable': true,
      'Form-field--focused': this.state.focused,
      'is-mobile': this.props.fullscreen
    });
    const searchInputFieldClasses = classSet({
      'Arrange-sizeFill u-paddingR Form-placeholder': true,
      'u-textSizeBaseMobile': this.props.fullscreen
    });
    const searchInputFieldIconClasses = classSet({
      'Arrange-sizeFit u-isActionable': true,
      'u-userTextColor': this.state.focused,
      'u-userFillColor': this.state.focused
    });
    const clearInputClasses = classSet({
      'Icon Icon--clearInput': true,
      'u-isActionable u-textCenter': true,
      'u-isHidden': !(isMobileBrowser() && !this.props.isLoading && this.state.searchInputVal)
    });
    const placeholder = (isMobileBrowser())
                      ? ''
                      : i18n.t('embeddable_framework.helpCenter.search.label.how_can_we_help');

    return (
      <div className={searchContainerClasses}>
        <label className={searchInputClasses}>
          <Icon
            className={searchInputFieldIconClasses}
            onClick={this.props.onSearchIconClick}
            type='Icon--search' />
          <div className='Arrange-sizeFill u-vsizeAll u-posRelative'>
            <input
              className={searchInputFieldClasses}
              ref='searchFieldInput'
              onChange={this.onChange}
              value={this.state.searchInputVal}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              autoCapitalize="off"
              autoCorrect="off"
              placeholder={placeholder}
              type='search' />
          </div>
          <div className='Arrange-sizeFit u-isActionable'>
            <LoadingEllipses className={loadingClasses} />
            <Icon
              onClick={this.clearInput}
              onTouch={this.clearInput}
              className={clearInputClasses}
              type='Icon--clearInput' />
          </div>
        </label>
      </div>
    );
  }
});

export { Field, SearchField, SearchFieldButton, getCustomFields };
