import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { locals as styles } from './Dropdown.scss';
import { DropdownMenu } from 'component/field/DropdownMenu';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { document } from 'utility/globals';
import { keyCodes } from 'utility/keyboard';

const animationDuration = 200;

export class Dropdown extends Component {
  static propTypes = {
    name: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    menuContainerClassName: PropTypes.string,
    arrowClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    fullscreen: PropTypes.bool,
    getFrameDimensions: PropTypes.func.isRequired,
    landscape: PropTypes.bool,
    description: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    value: PropTypes.object,
    optionFormat: PropTypes.func,
    selectionFormat: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMenuChange: PropTypes.func,
    placeholderNode: PropTypes.node
  }

  static defaultProps = {
    fullscreen: false,
    getFrameDimensions: () => {
      return { height: 500, width: 342 };
    },
    className: '',
    menuContainerClassName: '',
    containerClassName: '',
    arrowClassName: '',
    inputClassName: '',
    landscape: false,
    description: '',
    onChange: () => {},
    options: [],
    label: '-',
    required: false,
    placeholderNode: '-',
    value: { value: '' },
    optionFormat: _.identity,
    selectionFormat: _.identity,
    onFocus: () => {},
    onBlur: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onMenuChange: () => {}
  }

  constructor (props) {
    super(props);

    const initialMenu = (
      <DropdownMenu
        ref={(m) => { this.menu = m; }}
        fullscreen={this.props.fullscreen}
        options={this.formatDropdownOptions(this.props.options)}
        optionFormat={this.props.optionFormat}
        onOptionClick={this.setValue} />
    );

    this.state = {
      hovering: false,
      selected: this.selected || props.value,
      displayedMenu: initialMenu,
      previousMenus: [],
      open: false,
      animatingNext: false,
      animatingBack: false,
      valid: true
    };

    this.containerClicked = false;
    this.input = null;
    this.menu = null;
    this.height = 0;
  }

  componentDidUpdate = () => {
    const el = ReactDOM.findDOMNode(this);

    this.height = el.getBoundingClientRect().top;
  }

  handleFocus = (e) => {
    if (this.containerClicked) {
      this.setState({ open: true });
    }
    this.props.onFocus(e);
  }

  handleBlur = (e) => {
    this.setState({ open: this.containerClicked });

    if (this.containerClicked && !this.props.fullscreen) {
      this.input.focus();
    } else {
      const valid = !this.props.required || !!this.state.selected.value;

      this.setState({ valid });
    }
    this.props.onBlur(e);
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
      case keyCodes.UP:
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
    this.props.onMouseEnter();
  }

  handleMouseLeave = () => {
    this.setState({ hovering: false });
    this.props.onMouseLeave();
  }

  setValue = (value, name) => () => {
    this.setState({
      selected: { value, name },
      open: false
    });

    setTimeout(() => this.props.onChange(value, name), 0);
  }

  handleBackClick = (focusField = false) => {
    if (this.state.previousMenus.length === 0) return;

    this.setState({
      animatingBack: true,
      displayedMenu: this.state.previousMenus[0]
    });

    this.state.previousMenus.shift();

    this.handleAnimationComplete('animatingBack', focusField);
  }

  updateMenu = (menu, focusField = false) => {
    this.state.previousMenus.unshift(this.state.displayedMenu);

    this.setState({
      displayedMenu: menu,
      animatingNext: true
    });

    this.handleAnimationComplete('animatingNext', focusField);
  }

  handleAnimationComplete = (animatingDirection, focusField) => {
    setTimeout(() => {
      this.setState({ [animatingDirection]: false });

      if (focusField) {
        setTimeout(() => this.menu.keyDown(keyCodes.DOWN), 0);
      }
    }, animationDuration);
  }

  formatDropdownOptions = (optionsProp) => {
    const options = _.cloneDeep(optionsProp);
    const groupByFn = (option) => {
      return (option.name.indexOf('::') > -1)
           ? option.name.split('::')[0]
           : '';
    };
    const mapFn = (group, key, allGroups) => {
      if (_.isEmpty(key)) {
        return _.map(group, (option) => {
          // Don't return duplicate fields. ie `one` and `one::two`
          if (!_.includes(_.keys(allGroups), option.name)) {
            if (option.default) {
              this.selected = option;
            }

            return {
              name: option.name,
              onClick: this.setValue(option.value, option.name),
              value: option.value,
              id: _.uniqueId('option-')
            };
          }
        });
      } else {
        // Remove the groups name from the name value.
        _.forEach(group, (item) => {
          item.name = item.name.substring(item.name.indexOf('::') + 2);
        });

        // And look for further nesting
        const nestedOptions = this.formatDropdownOptions(group);
        const menu = (
          <DropdownMenu
            ref={(m) => { this.menu = m; }}
            backButton={true}
            handleBackClick={this.handleBackClick}
            fullscreen={this.props.fullscreen}
            optionFormat={this.props.optionFormat}
            options={nestedOptions} />
        );

        return {
          name: key,
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
    const arrowClasses = `
      ${styles.arrow}
      ${this.props.arrowClassName}
      ${iconOpenClasses}
      ${hoveredClasses}
    `;

    return (
      <Icon type='Icon--chevron' className={arrowClasses} />
    );
  }

  renderMenus = () => {
    if (!this.state.open) {
      this.props.onMenuChange(false);
      return;
    }

    let backClasses = '', nextClasses = '';

    if (this.state.animatingBack) {
      backClasses = i18n.isRTL() ? styles.animateRight : styles.animateLeft;
    }

    if (this.state.animatingNext) {
      nextClasses = i18n.isRTL() ? styles.animateLeft : styles.animateRight;
    }

    const mobileClasses = this.props.fullscreen ? styles.menuContainerMobile : '';

    // If the dropdown is below half the height of the frame have it open up.
    const frameHeightValue = this.props.getFrameDimensions().height;
    const frameHeight = frameHeightValue === '100%' || !frameHeightValue
                 ? document.documentElement.clientHeight
                 : frameHeightValue;
    const posClasses = this.height > frameHeight/2 ? styles.menuUp : '';

    const containerClasses = `
      ${styles.menuContainer}
      ${posClasses}
      ${mobileClasses}
      ${this.props.menuContainerClassName}
    `;

    this.props.onMenuChange(true);

    return (
      <div className={containerClasses}>
        <div className={`${styles.menu} ${nextClasses} ${backClasses}`}>
          {this.state.displayedMenu}
        </div>
      </div>
    );
  }

  renderSelectionText = () => {
    const selection = this.state.selected.name || this.props.placeholderNode;

    return this.props.selectionFormat(selection);
  }

  renderLabel = (landscapeClasses, mobileClasses) => {
    const { label, required } = this.props;
    const includeLabel = label !== '-';
    const requiredLabel = required ? '*' : '';

    if (includeLabel) {
      return (
        <div className={`${styles.label} ${landscapeClasses} ${mobileClasses}`}>
          {label}{requiredLabel}
        </div>
      );
    }
  }

  render = () => {
    const mobileClasses = this.props.fullscreen && !this.props.landscape ? styles.labelMobile : '';
    const landscapeClasses = this.props.landscape ? styles.labelLandscape : '';
    const invalidClasses = !this.state.valid ? styles.inputError : '';
    const containerClasses = this.props.className;
    const inputClasses = `
      ${styles.input}
      ${invalidClasses}
      ${mobileClasses}
      ${landscapeClasses}
      ${this.props.inputClassName}
    `;
    const dropdownContainer = `
      ${styles.container}
      ${this.props.containerClassName}
    `;

    return (
      <div className={containerClasses} onMouseDown={this.handleContainerClick}>
        {this.renderLabel(landscapeClasses, mobileClasses)}
        <div className={dropdownContainer}>
          <div
            ref={(i) => this.input = i}
            className={inputClasses}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onKeyDown={this.handleKeyDown}
            onMouseDown={this.handleInputClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            tabIndex='0'>
            {this.renderSelectionText()}
          </div>
          {this.props.description !== '' ? <div className={styles.description}>{this.props.description}</div> : ''}
          {/* hidden field with the selected value so that the form grabs it on submit */}
          <input
            onChange={_.noop} // Prevents console errors describing readOnly like usage
            className='u-isHidden'
            name={_.toString(this.props.name)}
            required={this.props.required}
            value={this.state.selected.value} />
          {this.renderDropdownArrow()}
          {this.renderMenus()}
        </div>
      </div>
    );
  }
}
