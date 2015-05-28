import React from 'react/addons';

import { Loading }         from 'component/Loading';
import { isMobileBrowser } from 'utility/devices';
import { i18n }            from 'service/i18n';

const classSet = React.addons.classSet,
      geti18nContent = function(field) {
        let title = _.find(field.variants, function(variant) {
                      return variant.localeId === i18n.getLocaleId();
                    });

        return title ? title.content : field.title;
      },
      getCustomFields = function(customFields, formState) {
        let checkboxes = [],
            fields = _.chain(customFields)
              .map(function(field) {
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

                switch(field.type) {
                  case 'text':
                    return (
                      <Field {...sharedProps} />
                    );
                  case 'tagger':
                    _.forEach (field.options, function(option) {
                      if (option.variants) {
                        option.title = geti18nContent(option);
                      }
                    });
                    return (
                      <SelectField
                        {...sharedProps}
                        options={field.options}
                      />
                    );
                  case 'integer':
                    return (
                      <Field
                        {...sharedProps}
                        pattern='\d+'
                      />
                    );
                  case 'decimal':
                    return (
                      <Field
                        {...sharedProps}
                        pattern='\d*[.,]\d+'
                      />
                    );
                  case 'textarea':
                    /* jshint quotmark:false */
                    return (
                      <Field
                        {...sharedProps}
                        input={
                          <textarea
                            rows='5'
                          />
                        }
                      />
                    );
                  case 'checkbox':
                    // Push this into a separate array as it needs to render in a
                    // different location to other custom fields.
                    checkboxes.push(
                      <Field
                        {...sharedProps}
                        label={field.title}
                        type='checkbox'
                      />
                    );
                }
              })
              .compact()
              .value();

          return { fields, checkboxes };
      };

const Field = React.createClass({
  propTypes: {
    name: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]).isRequired,
    placeholder: React.PropTypes.string,
    icon: React.PropTypes.string,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    input: React.PropTypes.element,
    required: React.PropTypes.bool,
    label: function(props, propName, componentName) {
      if(props.type === 'checkbox' && !props[propName]) {
        return new Error(`${componentName} must have a label prop if type is set to "checkbox"`);
      }
    }
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

  onFocus() {
    this.setState({
      focused: true
    });
  },

  onBlur() {
    const result = this.refs.field.getDOMNode();

    this.setState({
      focused: false,
      blurred: true,
      hasError: !result.validity.valid,
      dirty: !this.state.value
    });
  },

  onChange(e) {
    const value = e.target.value,
          result = this.refs.field.getDOMNode();

    this.setState({
      value: value,
      hasError: !result.validity.valid
    });
  },

  render() {
    const icon = this.props.icon,
          type = this.props.type,
          checkbox = type === 'checkbox',
          iconFieldClasses = classSet({
            'Arrange-sizeFill u-vsizeAll': true,
            'u-textSize15': isMobileBrowser(),
            'u-textSecondary': this.props.input,
            'Form-checkbox u-isHiddenVisually': checkbox,
            'Form-checkbox--focused': this.state.focused && checkbox,
            'Form-checkbox--invalid': this.state.hasError && this.state.blurred && checkbox,
          }),
          iconClasses = classSet({
            'u-isHidden': !icon,
            [`Arrange-sizeFit u-isActionable Icon Icon--${icon} u-alignTop`]: true
          }),
          fieldClasses = classSet({
            'Arrange Arrange--middle Form-field u-isSelectable u-posRelative': true,
            'Form-field--invalid': this.state.hasError && this.state.blurred && !checkbox,
            'Form-field--focused': this.state.focused && !checkbox,
            'Form-field--dropdown': this.props.options,
            'Form-field--clean': checkbox
          }),
          dropdownClasses = classSet({
            'u-isHidden': !this.props.options,
            'Arrange-sizeFit Form-field__arrows': true
          }),
          sharedProps = {
            onChange: this.onChange,
            onBlur: this.onBlur,
            onFocus: this.onFocus,
            ref: 'field',
            className: iconFieldClasses,
            value: this.props.value
          };

    return (
      <label className={fieldClasses}>
        <i className={iconClasses} />
        {
          /* jshint laxbreak: true */
          this.props.input
            ? React.addons.cloneWithProps(this.props.input, _.extend({}, sharedProps, this.props))
            : <input {...sharedProps} {...this.props} />
        }
        {
          this.props.label
          && <span className='Form-checkboxCaption u-isActionable'>{this.props.label}</span>
        }
        <div className={dropdownClasses}>
          <i className='Icon--dropdownArrow' />
          <i className='Icon--dropdownArrow Icon--dropdownArrowBottom' />
        </div>
      </label>
    );
  }
});

/*jshint unused:false*/
const SelectField = React.createClass({
  propTypes: {
    name: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]).isRequired,
    options: React.PropTypes.array.isRequired
  },

  formatOptions() {
    var props = this.props,
        options = [
          <option value='' key={props.placeholder}>{props.placeholder}</option>
        ],
        optionGroups;

    optionGroups = _.groupBy(props.options, function(option) {
      /* jshint laxbreak: true */
      return (option.title.indexOf('::') > 0)
           ? option.title.split('::', 1)
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
          var title = nestedOption.title.split('::')[1];
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
        input={
          <select>
            {this.formatOptions()}
          </select>
        }
      />
    );
  }
});

const SearchField = React.createClass({
  getInitialState() {
    return {
      focused: false,
      blurred: false,
      searchInputVal: '',
      isClearable: false
    };
  },

  onFocus() {
    this.setState({
      focused: true
    });
  },

  onBlur() {
    this.setState({
      focused: false,
      blurred: true
    });
  },

  handleUpdate(e) {
    let value = e.target.value;

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
    let loadingClasses = classSet({
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
          'Arrange Arrange--middle Form-field Form-field--search u-isSelectable': true,
          'Form-field--focused': this.state.focused
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
                    : i18n.t('embeddable_framework.helpCenter.search.label.how_can_we_help');

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
              autoCapitalize="off"
              autoCorrect="off"
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

export { Field, SearchField, getCustomFields };

