import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { locals as styles } from './Dropdown.sass';
import { DropdownOption } from 'src/component/field/DropdownOption';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class Dropdown extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    value: PropTypes.string
  }

  constructor (props) {
    super(props);

    const initialScreen = this.renderDropdown(this.props.options);

    this.state = {
      selected: props.value || {
        title: props.placeholder || 'Select...',
        value: ''
      },
      displayedScreen: initialScreen,
      previousScreen: [],
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

  updateScreen = (screen) => {
    this.state.previousScreen.unshift(this.state.displayedScreen);

    this.setState({ displayedScreen: screen });
  }

  onBackClick = () => {
    this.setState({ displayedScreen: this.state.previousScreen[0] });

    this.state.previousScreen.shift();
  }

  renderOption = (option) => {
    const { value, title } = option;

    return (
      <DropdownOption
        title={title}
        nestedOptions={null}
        onClick={this.setValue.bind(this, value, title)} />
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

        optionObj.push(<DropdownOption title={key} nestedOptions={nestedOptions} updateScreen={this.updateScreen} />);
      }
    });

    return optionObj;
  }

  renderBackArrow = () => {
    if (this.state.previousScreen.length <= 0) return;

    return (
      <div
        className={`${styles.field} ${styles.back}`}
        onClick={this.onBackClick}>
        <div className={styles.arrowBack} />
        {i18n.t('embeddable_framework.navigation.back')}
      </div>
    );
  }

  renderMenu = () => {
    if (!this.state.isOpen) return;

    return (
      <div className={styles.menu}>
        {this.renderBackArrow()}
        {this.state.displayedScreen}
      </div>
    );
  }

  renderArrow = () => {
    const iconOpenClasses = this.state.isOpen ? styles.arrowOpen : '';

    return (
      <Icon type='Icon--caret' className={`${styles.arrow} ${iconOpenClasses}`} />
    );
  }

  render = () => {
    return (
      <div>
        <div className={styles.label}>{this.props.placeholder}</div>
        <div className={styles.container}>
          <div
            onMouseDown={this.handleMouseDown}
            onTouchEnd={this.handleMouseDown}>
            {this.state.selected.title}
            {this.renderArrow()}
          </div>
          {this.renderMenu()}
        </div>
      </div>
    );
  }
}
