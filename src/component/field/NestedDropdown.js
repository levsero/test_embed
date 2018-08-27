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
  Hint,
  Message } from '@zendeskgarden/react-select';
import { Icon } from 'component/Icon';

import { i18n } from 'service/i18n';
import { FONT_SIZE } from 'constants/shared';

import { locals as styles } from './NestedDropdown.scss';

export class NestedDropdown extends Component {
  static propTypes = {
    getFrameContentDocument: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    label: PropTypes.object.isRequired,
    name: PropTypes.string,
    showError: PropTypes.bool,
    onChange: PropTypes.func,
    description: PropTypes.string,
    required: PropTypes.bool
  }

  static defaultProps = {
    name: '',
    required: false,
    showError: false,
    description: '',
    onChange: () => {},
    getFrameContentDocument: () => ({})
  }

  constructor(props) {
    super();

    const { defaultOption } = props;

    this.state = {
      selectedKey: defaultOption ? defaultOption.value : undefined,
      displayedKey: defaultOption ? defaultOption.value : ''
    };

    this.options = this.groupOptions(props.options);
    this.items = this.renderItems(this.options);
    this.topLevelMenu = _.filter(this.items, (option, key) => !_.includes(key, '::'));
  }

  groupOptions = (options) => {
    return _.chain(options)
      .sortBy('name')
      .groupBy('name')
      .reduce((groupedOptions, option, name) => {
        // Handle cases where parent isn't specified in the dropdown options
        // eg 1::2::3 is a value but 1::2 isn't
        // Adds the missing keys to the object
        const splitName = name.split('::').slice(0, -1);

        _.forEach(splitName, (_, index) => {
          const nestedOption = name.split('::', index+1).join('::');

          if (!groupedOptions[nestedOption]) {
            groupedOptions[nestedOption] = { name: nestedOption, value: `${nestedOption}-nested` };
          }
        });

        // Add main key to object
        groupedOptions[name] = _.head(option);

        return groupedOptions;
      }, {})
      .value();
  }

  renderItems = (options) => {
    return _.reduce(options, (items, option, name) => {
      const hasNestedOptions = this.findNestedOptionsByName(name).length > 0;
      const splitName = name.split('::');
      const titleName = splitName[splitName.length-1];

      if (hasNestedOptions) {
        items[name] = <NextItem key={`${option.value}-next`}>{titleName}</NextItem>;
      } else {
        items[name] = <Item key={option.value}>{titleName}</Item>;
      }

      return items;
    }, {});
  }

  findOptionNameFromValue = (value) => {
    const option = _.find(this.options, (option) => option.value === value);
    const name = _.get(option, 'name', '').split('::');

    return name[name.length-1];
  }

  findNestedOptionsByName = (name) => {
    return _.filter(this.options, option => {
      return _.includes(option.name, name) && _.includes(option.name, '::') && option.name !== name;
    });
  }

  findNestedMenuByName = (name) => {
    return _.filter(this.options, option => {
      // Removes the final `::name` value from the name string
      const optionMenuName = name.split('::').slice(0, -1).join('::');

      return _.includes(option.name, optionMenuName);
    });
  }

  formatBackMenu = (menu, backName, depth) => {
    const items = _.chain(menu.slice(1))
      .filter(titleItem => titleItem.name.split('::').length === depth) // Get items at the correct depth
      .map(titleItem => this.items[titleItem.name]) // Map to their react components
      .value();

    const back = backName ? this.options[backName] : '';

    return [

      <PreviousItem key={`${back.value}-prev`}>
        <Icon type='Icon--previous' className={styles.previous} />
        {this.findOptionNameFromValue(menu[0].value)}
      </PreviousItem>,
      <Separator key={`${menu[0].value}-separator`} />,
      ...items
    ];
  }

  renderMenuItems = (selectedKey) => {
    const selectedKeyOption = _.find(this.options, (option) => option.value === selectedKey);

    if (!selectedKeyOption) return this.topLevelMenu;

    const nestedOptions = this.findNestedOptionsByName(selectedKeyOption.name);
    const splitName = selectedKeyOption.name.split('::');

    // Handles the next and previous buttons selected
    if (nestedOptions.length > 0) {
      const backName = splitName.slice(0, -1).join('::');
      const depth = splitName.length + 1;

      return this.formatBackMenu([selectedKeyOption, ...nestedOptions], backName, depth);
    // Handles a nested option selected
    } else if (splitName.length > 1) {
      const menu = this.findNestedMenuByName(selectedKeyOption.name);
      const backName = splitName.slice(0, -2).join('::');
      const depth = splitName.length;

      return this.formatBackMenu(menu, backName, depth);
    // Otherwise return the top level of options
    } else {
      return this.topLevelMenu;
    }
  }

  handleChange = (selectedKey) => {
    let displayedKey = this.state.displayedKey;

    if (_.includes(selectedKey, '-prev')) {
      selectedKey = selectedKey.replace('-prev', '');
    } else if (_.includes(selectedKey, '-next')) {
      selectedKey = selectedKey.replace('-next', '');
    } else {
      displayedKey = selectedKey;
    }

    this.setState({ selectedKey, displayedKey });
    setTimeout(this.props.onChange, 0);
  }

  render() {
    return (
      <div className={styles.field}>
        <SelectField>
          {this.props.label}
          <Hint>{this.props.description}</Hint>
          <Select
            isOpen={this.state.isOpen}
            appendToNode={this.props.getFrameContentDocument().body}
            onStateChange={newState => this.setState(newState)}
            onChange={this.handleChange}
            options={this.renderMenuItems(this.state.selectedKey)}
            validation={this.props.showError ? 'error': 'none'}
            dropdownProps={{
              style: {
                maxHeight: `${240/FONT_SIZE}rem`,
                overflow: 'auto',
                boxShadow: `0 ${10/FONT_SIZE}rem ${30/FONT_SIZE}rem 0 rgba(4, 68, 77, 0.15)`
              }
            }}>
            {this.findOptionNameFromValue(this.state.displayedKey) || '-'}
          </Select>
          {this.props.showError &&
            <Message validation='error'>
              {i18n.t('embeddable_framework.validation.error.select')}
            </Message>}
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
