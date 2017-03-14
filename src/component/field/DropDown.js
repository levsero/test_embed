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
      previousMenus: [],
      open: false,
      animatingNext: false,
      animatingBack: false
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

  handleBackClick = (focusField = false) => {
    if (this.state.previousMenus.length === 0) return;

    this.setState({
      animatingBack: true,
      displayedMenu: this.state.previousMenus[0]
    });

    this.state.previousMenus.shift();

    setTimeout(() => {
      this.setState({
        animatingBack: false
      });

      if (focusField) {
        setTimeout(() => this.menu.keyDown(keyCodes.DOWN), 0);
      }
    }, 200);
  }

  updateMenu = (menu, focusField = false) => {
    this.state.previousMenus.unshift(this.state.displayedMenu);

    this.setState({
      displayedMenu: menu,
      animatingNext: true
    });

    setTimeout(() => {
      this.setState({
        animatingNext: false
      });

      if (focusField) {
        setTimeout(() => this.menu.keyDown(keyCodes.DOWN), 0);
      }
    }, 200);
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

  renderMenus = () => {
    if (!this.state.open) return;

    const backClasses = this.state.animatingBack ? styles.menuBackAnimate : '';
    const nextClasses = this.state.animatingNext ? styles.menuNextAnimate : '';
    const mobileClasses = this.props.fullscreen ? styles.menuContainerMobile : '';

    return (
      <div className={`${styles.menuContainer} ${mobileClasses}`}>
        <div className={`${styles.menu} ${nextClasses} ${backClasses}`}>
          {this.state.displayedMenu}
        </div>
      </div>
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
          {this.renderMenus()}
        </div>
      </div>
    );
  }
}
