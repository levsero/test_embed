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

  handleMouseDown = (event) => {
    if (event.type === 'mousedown' && event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();

    this.setState({ isOpen: !this.state.isOpen });
  }

  setValue = (value, title) => {
    this.setState({
      selected: { value, title },
      isOpen: false
    });
  }

  renderOption = (option) => {
    const { value, title } = option;

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

  renderDropdown = (optionsProp) => {
    const optionObj = [];

    const options = _.cloneDeep(optionsProp);

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

        optionObj.push(<DropdownOption title={key} nestedOptions={nestedOptions} />);
      }
    });

    return optionObj;
  }

  render = () => {
    let value = (<div className={`placeholder`}>{this.state.selected.title}</div>);
    let menu = this.state.isOpen ? <div className={styles.menu}>{this.renderDropdown(this.props.options)}</div> : null;

    return (
      <div className={styles.container}>
        <div
          onMouseDown={this.handleMouseDown}
          onTouchEnd={this.handleMouseDown}>
          {value}
          <span className={`arrow`} />
        </div>
        {menu}
      </div>
    );
  }
}
