import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { Field } from 'component/field/Field';

export class SelectField extends Component {
  formatOptions() {
    const props = this.props;
    const options = [
      <option value='' key='' disabled={props.required}>-</option>
    ];

    const optionGroups = _.groupBy(props.options, (option) => {
      return (option.title.indexOf('::') !== -1)
           ? option.title.split('::')[0]
           : '';
    });

    _.forEach(optionGroups, (group, key) => {
      let nestedOptions;

      // if not a nested field
      if (_.isEmpty(key)) {
        _.forEach(group, (option) => {
          options.push(
            <option value={option.value} key={option.title}>{option.title}</option>
          );
        });
      } else {
        nestedOptions = _.map(group, (nestedOption) => {
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
  }

  render() {
    return (
      <Field
        {...this.props}
        input={<select>{this.formatOptions()}</select>} />
    );
  }
}

SelectField.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  options: PropTypes.array.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};

SelectField.defaultProps = {
  onFocus: () => {},
  onBlur: () => {}
};
