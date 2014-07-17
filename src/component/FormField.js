/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';
import { validation } from 'mixin/validation';

var { FieldMixin } = ReactForms,
    Property = ReactForms.schema.Property,
    isFailure = ReactForms.validation.isFailure,
    classSet = React.addons.classSet;

var FocusField = React.createClass({
  mixins: [FieldMixin],

  getInitialState() {
    return {
      focused: false
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
        <input placeholder={props.placeholder} className='Arrange-sizeFill' />
      }
      validate={props.validate || ''}
      component={<FocusField icon={props.icon} />}
    />
  );
}

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
        placeholder='Email address'
        className='Arrange-sizeFill' />
    ),
    validate: function(value) {
      return validation.validateEmail(value);
    }
  });
}

export { IconField, EmailField };

