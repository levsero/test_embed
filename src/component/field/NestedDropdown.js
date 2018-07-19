import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  SelectField,
  Select,
  Separator,
  Item,
  NextItem,
  PreviousItem,
  Label } from '@zendeskgarden/react-select';

export class NestedDropdown extends Component {
  static propTypes = {
    getFrameContentDocument: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    label: PropTypes.string,
    name: PropTypes.string,
    required: PropTypes.bool
  }

  static defaultProps = {
    label: '',
    name: '',
    required: false,
    getFrameContentDocument: () => ({})
  }

  constructor(props) {
    super();

    const { defaultOption } = props;

    this.state = {
      selectedKey: defaultOption ? defaultOption.value : undefined,
      focusedKey: undefined,
      displayedKey: defaultOption ? defaultOption.value : ''
    };

    this.groupedOptions = this.groupOptions(props.options);
    this.formattedOptions = this.sortOptions(this.groupedOptions);
    this.topLevel = _.filter(this.formattedOptions, (option, key) => !key.includes('::'));
  }

  groupOptions = (options) => {
    return _.chain(options)
      .sortBy('name')
      .groupBy('name')
      .reduce((acc, item, key) => {
        // Handle cases where parent isn't specified in the dropdown options
        // eg 1::2::3 is a value but 1::2 isn't
        const splitKey = key.split('::').slice(0, -1);

        _.forEach(splitKey, (_, index) => {
          const nestedOption = key.split('::', index+1).join('::');

          if (!acc[nestedOption]) {
            acc[nestedOption] = { name: nestedOption, value: `${nestedOption}-nested` };
          }
        });

        // Add main key to options
        acc[key] = _.head(item);

        return acc;
      }, {})
      .value();
  }

  sortOptions = (options) => {
    return _.reduce(options, (acc, item, key, obj) => {
      const depth = key.split('::');
      const name = depth[depth.length-1];
      const nested = _.filter(obj, stuff => stuff.name.includes(key));

      if (nested.length > 1) {
        acc[key] = <NextItem key={`${item.value}-next`}>{name}</NextItem>;
      } else {
        acc[key] = <Item key={item.value}>{name}</Item>;
      }

      return acc;
    }, {});
  }

  findOptionNameFromValue = (value) => {
    const option = _.find(this.groupedOptions, (option) => option.value === value);
    const name = _.get(option, 'name', '').split('::');

    return name[name.length-1];
  }

  findNestedOptionsByName = (name) => {
    return _.filter(this.groupedOptions, option => {
      return option.name && option.name.includes(name);
    });
  }

  findNestedMenuByName = (name) => {
    return _.filter(this.groupedOptions, option => {
      return option.name && option.name.includes(name.split('::').slice(0, -1).join('::'));
    });
  }

  formatBackMenu = (menu, backName, depth) => {
    const leaf = _.chain(menu.slice(1))
      .filter(subitem => subitem.name.split('::').length === depth)
      .map(subitem => this.formattedOptions[subitem.name])
      .value();

    const back = backName ? this.groupedOptions[backName] : '';

    return [
      <PreviousItem key={`${back.value}-prev`}>{this.findOptionNameFromValue(menu[0].value)}</PreviousItem>,
      <Separator key={`${menu[0].value}-separator`} />,
      ...leaf
    ];
  }

  retrieveMenuItems = (selectedKey) => {
    const selectedKeyOption = _.find(this.groupedOptions, (option) => option.value === selectedKey);

    if (!selectedKeyOption) return this.topLevel;

    const nestedOptions = this.findNestedOptionsByName(selectedKeyOption.name);
    const splitName = selectedKeyOption.name.split('::');

    // Handles the next and previous buttons selected
    if (nestedOptions.length > 1) {
      const backName = splitName.slice(0, -1).join('::');
      const depth = splitName.length + 1;

      return this.formatBackMenu(nestedOptions, backName, depth);
    // Handles a nested option selected
    } else if (splitName.length > 1) {
      const menu = this.findNestedMenuByName(selectedKeyOption.name);
      const backName = splitName.slice(0, -2).join('::');
      const depth = splitName.length;

      return this.formatBackMenu(menu, backName, depth);
    // Otherwise return the top level of options
    } else {
      return this.topLevel;
    }
  }

  handleChange = (selectedKey) => {
    let displayedKey = this.state.displayedKey;

    if (selectedKey.includes('-prev')) {
      selectedKey = selectedKey.replace('-prev', '');
    } else if (selectedKey.includes('-next')) {
      selectedKey = selectedKey.replace('-next', '');
    } else {
      displayedKey = selectedKey;
    }

    this.setState({ selectedKey, displayedKey });
  }

  render() {
    return (
      <div>
        <SelectField>
          <Label>{this.props.label}</Label>
          <Select
            isOpen={this.state.isOpen}
            focusedKey={this.state.focusedKey}
            appendToNode={this.props.getFrameContentDocument().body}
            onStateChange={newState => this.setState(newState)}
            onChange={this.handleChange}
            options={this.retrieveMenuItems(this.state.selectedKey)}
            dropdownProps={{ style: { maxHeight: 215, overflow: 'auto' }}}>
            {this.findOptionNameFromValue(this.state.displayedKey) || '-'}
          </Select>
        </SelectField>
        {/* hidden field with the selected value so that the form grabs it on submit */}
        <input
          onChange={() => {}}
          className='u-isHidden'
          name={_.toString(this.props.name)}
          required={this.props.required}
          value={this.state.displayedKey} />
      </div>
    );
  }
}
