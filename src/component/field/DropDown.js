import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { locals as styles } from './Dropdown.sass';
import { DropdownMenu } from 'component/field/DropdownMenu';
import { Icon } from 'component/Icon';
import { keyCodes } from 'utility/keyboard';

const animationDuration = 200;

export class Dropdown extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    frameHeight: PropTypes.number,
    landscape: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    value: PropTypes.object
  }

  static defaultProps = {
    fullscreen: false,
    frameHeight: 500,
    landscape: false,
    name: '',
    onChange: () => {},
    options: [],
    placeholder: '-',
    required: false,
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

  handleFocus = () => {
    if (this.containerClicked) {
      this.setState({ open: true });
    }
  }

  handleBlur = () => {
    this.setState({ open: this.containerClicked });

    if (this.containerClicked && !this.props.fullscreen) {
      this.input.focus();
    } else {
      const valid = !this.props.required || !!this.state.selected.value;

      this.setState({ valid });
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

    this.props.onChange();
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
      return (option.title.indexOf('::') > -1)
           ? option.title.split('::')[0]
           : '';
    };
    const mapFn = (group, key, allGroups) => {
      if (_.isEmpty(key)) {
        return _.map(group, (option) => {
          // Don't return duplicate fields. ie `one` and `one::two`
          if (!_.includes(_.keys(allGroups), option.title)) {
            if (option.default) {
              this.selected = option;
            }

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

    // If the dropdown is below half the height of the frame have it open up.
    const posClasses = this.height > this.props.frameHeight/2 ? styles.menuUp : '';

    return (
      <div className={`${styles.menuContainer} ${posClasses} ${mobileClasses}`}>
        <div className={`${styles.menu} ${nextClasses} ${backClasses}`}>
          {this.state.displayedMenu}
        </div>
      </div>
    );
  }

  render = () => {
    const mobileClasses = this.props.fullscreen && !this.props.landscape ? styles.labelMobile : '';
    const landscapeClasses = this.props.landscape ? styles.labelLandscape : '';
    const invalidClasses = !this.state.valid ? styles.inputError : '';
    const placeholderText = this.state.selected.title || '-';
    const requiredLabel = this.props.required ? '*' : '';

    return (
      <div onMouseDown={this.handleContainerClick}>
        <div className={`${styles.label} ${landscapeClasses} ${mobileClasses}`}>
          {this.props.placeholder}{requiredLabel}
        </div>
        <div className={styles.container}>
          <input
            ref={(i) => this.input = i}
            className={`${styles.input} ${invalidClasses} ${mobileClasses} ${landscapeClasses}`}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onMouseDown={this.handleInputClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            readOnly={true}
            onKeyDown={this.handleKeyDown}
            placeholder={placeholderText} />
          {/* hidden field with the selected value so that the form grabs it on submit */}
          <input
            type='hidden'
            className='u-isHidden'
            name={this.props.name}
            value={this.state.selected.value} />
          {this.renderDropdownArrow()}
          {this.renderMenus()}
        </div>
      </div>
    );
  }
}
