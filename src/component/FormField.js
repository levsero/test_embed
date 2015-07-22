import React from 'react/addons';
import _     from 'lodash';

import { Loading }         from 'component/Loading';
import { isMobileBrowser } from 'utility/devices';
import { i18n }            from 'service/i18n';
import { Icon }            from 'component/Icon';

var classSet = React.addons.classSet,
    geti18nContent = function(field) {
      var title = _.find(field.variants, function(variant) {
                    return variant.localeId === i18n.getLocaleId();
                  });

      return title ? title.content : field.title;
    },
    getCustomFields = function(customFields, formState) {
      var isCheckbox = (field) => field.props.type === 'checkbox',
          fields = _.map(customFields, function(field) {
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

var Field = React.createClass({
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
    const type = this.props.type,
          isCheckbox = (type === 'checkbox'),
          fieldClasses = classSet({
            'Form-field u-isSelectable u-posRelative': true,
            'Form-field--invalid': this.state.hasError && this.state.blurred && !isCheckbox,
            'Form-field--focused': this.state.focused && !isCheckbox,
            'Form-field--dropdown': this.props.options,
            'Form-field--clean': isCheckbox,
            'is-mobile': isMobileBrowser()
          }),
          fieldLabelClasses = classSet({
            'Form-fieldLabel u-textXHeight': true,
            'u-textSize15': isMobileBrowser()
          }),
          checkboxClasses = classSet({
            'Form-checkboxInput u-isHiddenVisually': isCheckbox,
            'Form-checkboxInput--focused': this.state.focused && isCheckbox,
            'Form-checkboxInput--invalid': this.state.hasError && this.state.blurred && isCheckbox
          }),
          dropdownClasses = classSet({
            'u-isHidden': !this.props.options,
            'Form-fieldArrows': true
          }),
          sharedProps = {
            onChange: this.onChange,
            onBlur: this.onBlur,
            onFocus: this.onFocus,
            ref: 'field',
            value: this.props.value
          },
          fieldProps = {
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
          {this.props.required ? '*' : ''}
        </div>
        <div className={fieldClasses}>
          {
            /* jshint laxbreak: true */
            (this.props.input)
              ? React.addons.cloneWithProps(
                  this.props.input,
                  _.extend({}, sharedProps, fieldProps, checkboxClasses)
                )
              : <input {...sharedProps} {...fieldProps} className={checkboxClasses} />
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
              ? <span className='Form-checkboxCaption u-nbfc u-isActionable'>
                  {this.props.label}
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

var SelectField = React.createClass({
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
      return (option.title.indexOf('::') !== -1)
           ? option.title.split('::')[0]
           : '';
    });

    _.forEach(optionGroups, function(group, key) {
      var nestedOptions;

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
        input={<select>{this.formatOptions()}</select>}
      />
    );
  }
});

var SearchField = React.createClass({
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
          'u-paddingTM': this.props.hasSearched,
          'u-marginBL': !this.props.hasSearched,
          'u-paddingHN u-paddingBN Form-cta--barFullscreen': this.props.fullscreen
        }),
        searchInputClasses = classSet({
          'Arrange Arrange--middle Form-field Form-field--search u-isSelectable': true,
          'Form-field--focused': this.state.focused,
          'is-mobile': this.props.fullscreen
        }),
        searchInputFieldClasses = classSet({
          'Arrange-sizeFill u-paddingR Form-placeholder': true,
          'u-textSizeBaseMobile': this.props.fullscreen
        }),
        searchInputFieldIconClasses = classSet({
          'Arrange-sizeFit u-isActionable': true,
          'u-userTextColor': this.state.focused,
          'u-userFillColor': this.state.focused
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
          <Icon
            className={searchInputFieldIconClasses}
            onClick={this.props.onSearchIconClick}
            type='Icon--search' />
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

