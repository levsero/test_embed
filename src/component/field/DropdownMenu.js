import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { locals as styles } from './DropdownMenu.sass';

import { DropdownOption } from 'component/field/DropdownOption';
import { i18n } from 'service/i18n';
import { keyCodes } from 'utility/keyboard';

export class DropdownMenu extends Component {
  static propTypes = {
    options: PropTypes.array,
    backButton: PropTypes.bool,
    handleBackClick: PropTypes.func
  }

  static defaultProps = {
    options: [],
    backButton: false,
    handleBackClick: () => {}
  }

  constructor (props) {
    super(props);

    this.focusedField = null;
    this.element = null;
    this.items = [];
  }

  componentWillUpdate() {
    this.items = [];
    this.focusedField = null;
    this.element = null;
  }

  componentWillUnmount() {
    this.items = [];
    this.focusedField = null;
    this.element = null;
  }

  getOption = (position) => {
    return this.items[position];
  }

  changeFocus = (newFocus) => {
    setTimeout(() => {
      if (this.items[this.focusedField] && this.items[newFocus]) {
        this.items[this.focusedField].blur();
      }
      if (this.items[newFocus]) {
        this.items[newFocus].focus();
        this.element.scrollTop = this.items[newFocus].element.offsetTop - 160;
        this.focusedField = newFocus;
      }
    }, 0);
  }

  keyDown = (key) => {
    if (this.focusedField === null) {
      this.focusedField = 0;
      setTimeout(() => this.items[this.focusedField].focus(), 0);
      return;
    }

    switch (key) {
      case keyCodes.DOWN:
        this.changeFocus(this.focusedField+1);
        break;
      case keyCodes.UP:
        this.changeFocus(this.focusedField-1);
        break;
      case keyCodes.RIGHT:
        this.items[this.focusedField].openNestedMenuFromKeyboard();
        break;
      case keyCodes.LEFT:
        this.props.handleBackClick(true);
        break;
      case keyCodes.ENTER:
        this.items[this.focusedField].handleDropdownOpen(null, null, true);
        break;
      default:
        return;
    }
  }

  renderBackArrow = () => {
    if (!this.props.backButton) return;

    return (
      <DropdownOption
        ref={(opt) => { if (opt !== null) this.items.unshift(opt); }}
        backButton={true}
        onClick={this.props.handleBackClick}
        title={i18n.t('embeddable_framework.navigation.back')} />
    );
  }

  renderOptions = () => {
    return _.map(this.props.options, (option) => {
      return (
        <DropdownOption
          ref={(opt) => { if (opt !== null) this.items.push(opt); }}
          title={option.title}
          key={option.title}
          onClick={option.onClick || _.noop}
          nestedMenu={option.nestedMenu || null}
          updateMenu={option.updateMenu || _.noop} />
      );
    });
  }

  render = () => {
    return (
      <div
        className={styles.menu}
        ref={(el) => { this.element = el; }}>
        {this.renderBackArrow()}
        {this.renderOptions()}
      </div>
    );
  }
}
