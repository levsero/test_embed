import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { locals as styles } from './Dropdown.sass';
import { DropdownOption } from 'src/component/field/DropdownOption';

export class Dropdown extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    value: PropTypes.string
  }

  constructor (props) {
    super(props);
    this.state = {
      selected: props.value || {
        title: props.placeholder || 'Select...',
        value: ''
      },
      isOpen: false
    };
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.value && newProps.value !== this.state.selected) {
      this.setState({selected: newProps.value});
    } else if (!newProps.value && newProps.placeholder) {
      this.setState({selected: { title: newProps.placeholder, value: '' }});
    }
  }

  handleMouseDown = (event) => {
    if (event.type === 'mousedown' && event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  setValue = (value, title) => {
    let newState = {
      selected: { value, title },
      isOpen: false
    };

    this.fireChangeEvent(newState);
    this.setState(newState);
  }

  fireChangeEvent (newState) {
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected);
    }
  }

  renderOption = (option) => {
    let value = option.value || option.title || option;
    let title = option.title || option.value || option;

    return (
      <div
        key={value}
        className={styles.field}
        onMouseDown={this.setValue.bind(this, value, title)}
        onClick={this.setValue.bind(this, value, title)}>
        {title}
      </div>
    );
  }

  renderDropdown = (options) => {
    const optionObj = [];

    const optionGroups = _.groupBy(options, (option) => {
      return (option.title.indexOf('::') !== -1)
           ? option.title.split('::')[0]
           : '';
    });

    _.forEach(optionGroups, (group, key) => {
      // if not nested anymore will be blank
      if (_.isEmpty(key)) {
        _.forEach(group, (option) => {
          if (!_.includes(_.keys(optionGroups), option.title)) {
            optionObj.push(this.renderOption(option));
          }
        });
      } else {
        // Remove the group title from the title.
        _.forEach(group, (item) => {
          item.title = item.title.substring(item.title.indexOf('::') + 2);
        });

        // And look for further nesting
        const nestedOptions = this.renderDropdown(group);

        optionObj.push(
          <DropdownOption title={key} nestedOptions={nestedOptions} />
        );
      }
    });

    return optionObj;
  }

  render = () => {
    const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.title;
    let value = (<div className={`placeholder`}>{placeHolderValue}</div>);
    let menu = this.state.isOpen ? <div className={styles.menu}>{this.renderDropdown(this.props.options)}</div> : null;

    return (
      <div className={styles.container}>
        <div
          onMouseDown={this.handleMouseDown.bind(this)}
          onTouchEnd={this.handleMouseDown.bind(this)}>
          {value}
          <span className={`arrow`} />
        </div>
        {menu}
      </div>
    );
  }
}
