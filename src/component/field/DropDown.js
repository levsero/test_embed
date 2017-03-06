import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { locals as styles } from './Dropdown.sass';
import { DropdownMenu } from 'component/field/DropdownMenu';
import { Icon } from 'component/Icon';
import { keyCodes } from 'utility/keyboard';

export class Dropdown extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    landscape: PropTypes.bool,
    options: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.object
  }

  static defaultProps = {
    fullscreen: false,
    landscape: false,
    options: [],
    placeholder: '',
    value: {}
  }

  constructor (props) {
    super(props);

    const initialMenu = (
      <DropdownMenu
        ref={(m) => { this.menu = m; }}
        fullscreen={this.props.fullscreen}
        options={this.formatDropdownOptions(this.props.options)}
        onOptionClick={this.setValue} />
    );

    this.state = {
      hovering: false,
      selected: props.value,
      displayedMenu: initialMenu,
      previousMenu: [],
      open: false
    };

    this.containerClicked = false;
    this.input = null;
    this.menu = null;
  }

  handleFocus = () => {
    if (this.containerClicked) {
      this.setState({ open: true });
    }
  }

  handleBlur = () => {
    this.setState({ open: this.containerClicked });

    if (this.containerClicked && !this.props.fullscreen) {
      this.input.focus();
    }
  }

  handleInputClick = () => {
    this.setState({ open: !this.state.open });
  }

  handleBackClick = (focusField = false) => {
    if (this.state.previousMenu.length === 0) return;

    this.setState({ displayedMenu: this.state.previousMenu[0] });

    this.state.previousMenu.shift();

    if (focusField) {
      setTimeout(() => this.menu.keyDown(keyCodes.DOWN), 0);
    }
  }

  handleContainerClick = () => {
    this.containerClicked = true;
    setTimeout(() => {
      this.containerClicked = false;
    }, 0);
  }

  handleKeyDown = (e) => {
    const key = e.keyCode;

    if (key === keyCodes.TAB) {
      return;
    } else {
      e.preventDefault();
    }

    switch (key) {
      case keyCodes.DOWN:
        this.setState({ open: true });
        setTimeout(() => this.menu.keyDown(key), 0);
        break;
      case keyCodes.ESC:
        this.setState({ open: false });
        break;
      default:
        if (this.menu) {
          this.menu.keyDown(key);
        }
    }
  }

  handleMouseEnter = () => {
    this.setState({ hovering: true });
  }

  handleMouseLeave = () => {
    this.setState({ hovering: false });
  }

  setValue = (value, title) => () => {
    this.setState({
      selected: { value, title },
      open: false
    });
  }

  updateMenu = (menu, focusField = false) => {
    this.state.previousMenu.unshift(this.state.displayedMenu);

    this.setState({ displayedMenu: menu });

    if (focusField) {
      setTimeout(() => this.menu.keyDown(keyCodes.DOWN), 0);
    }
  }

  formatDropdownOptions = (optionsProp) => {
    const options = _.cloneDeep(optionsProp);
    const groupByFn = (option) => {
      return (option.title.indexOf('::') > -1)
           ? option.title.split('::')[0]
           : '';
    };
    const mapFn = (group, key, allGroups) => {
      if (_.isEmpty(key)) {
        return _.map(group, (option) => {
          // Don't return duplicate fields. ie `one` and `one::two`
          if (!_.includes(_.keys(allGroups), option.title)) {
            return {
              title: option.title,
              onClick: this.setValue(option.value, option.title),
              value: option.value,
              id: _.uniqueId('option-')
            };
          }
        });
      } else {
        // Remove the groups name from the title value.
        _.forEach(group, (item) => {
          item.title = item.title.substring(item.title.indexOf('::') + 2);
        });

        // And look for further nesting
        const nestedOptions = this.formatDropdownOptions(group);
        const menu = (
          <DropdownMenu
            ref={(m) => { this.menu = m; }}
            backButton={true}
            handleBackClick={this.handleBackClick}
            fullscreen={this.props.fullscreen}
            options={nestedOptions} />
        );

        return {
          title: key,
          nestedMenu: menu,
          updateMenu: this.updateMenu,
          id: _.uniqueId('option-')
        };
      }
    };

    return _.chain(options)
          .groupBy(groupByFn)
          .flatMap(mapFn)
          .compact()
          .value();
  }

  renderDropdownArrow = () => {
    const iconOpenClasses = this.state.open ? styles.arrowOpen : '';
    const hoveredClasses = this.state.hovering ? styles.arrowHover : '';

    return (
      <Icon type='Icon--caret' className={`${styles.arrow} ${iconOpenClasses} ${hoveredClasses}`} />
    );
  }

  render = () => {
    const mobileClasses = this.props.fullscreen && !this.props.landscape ? styles.labelMobile : '';
    const landscapeClasses = this.props.landscape ? styles.labelLandscape : '';

    return (
      <div onMouseDown={this.handleContainerClick}>
        <div className={`${styles.label} ${landscapeClasses} ${mobileClasses}`}>
          {this.props.placeholder}
        </div>
        <div className={styles.container}>
          <input
            ref={(i) => this.input = i}
            className={`${styles.input} ${mobileClasses} ${landscapeClasses}`}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onMouseDown={this.handleInputClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            readOnly={true}
            onKeyDown={this.handleKeyDown}
            placeholder={this.state.selected.title} />
          {this.renderDropdownArrow()}
          <div className={styles.menuContainer}>
            <div className={`${styles.menu} ${styles.menuLeft}`}>{this.state.previousMenu[0]}</div>
            <div className={styles.menu}>{this.state.displayedMenu}</div>
          </div>
          {/*{this.state.open && this.state.displayedMenu}*/}
        </div>
      </div>
    );
  }
}
