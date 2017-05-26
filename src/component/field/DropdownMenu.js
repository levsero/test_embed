import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { DropdownOption } from 'component/field/DropdownOption';
import { i18n } from 'service/i18n';
import { keyCodes } from 'utility/keyboard';

export class DropdownMenu extends Component {
  static propTypes = {
    options: PropTypes.array,
    backButton: PropTypes.bool,
    fullscreen: PropTypes.bool,
    handleBackClick: PropTypes.func
  }

  static defaultProps = {
    options: [],
    backButton: false,
    fullscreen: false,
    handleBackClick: () => {}
  }

  constructor (props) {
    super(props);

    this.focusedFieldIndex = null;
    this.element = null;
    this.items = [];
  }

  componentWillUpdate() {
    this.items = [];
    this.focusedFieldIndex = null;
    this.element = null;
  }

  changeFocus = (newFocusIndex) => {
    const currentFocusItem = this.items[this.focusedFieldIndex];
    const newFocusItem = this.items[newFocusIndex];

    setTimeout(() => {
      if (currentFocusItem && newFocusItem) {
        currentFocusItem.blur();
      }
      if (newFocusItem) {
        newFocusItem.focus();
        // Keep item in view
        this.element.scrollTop = newFocusItem.element.offsetTop - 160;
        this.focusedFieldIndex = newFocusIndex;
      }
    }, 0);
  }

  keyDown = (key) => {
    if (this.focusedFieldIndex === null) {
      this.focusedFieldIndex = 0;
      setTimeout(() => this.items[this.focusedFieldIndex].focus(), 0);
      return;
    }

    switch (key) {
      case keyCodes.DOWN:
        this.changeFocus(this.focusedFieldIndex+1);
        break;
      case keyCodes.UP:
        this.changeFocus(this.focusedFieldIndex-1);
        break;
      case keyCodes.RIGHT:
        if (!i18n.isRTL()) {
          this.items[this.focusedFieldIndex].openNestedMenuFromKeyboard();
        } else {
          this.props.handleBackClick(true);
        }
        break;
      case keyCodes.LEFT:
        if (!i18n.isRTL()) {
          this.props.handleBackClick(true);
        } else {
          this.items[this.focusedFieldIndex].openNestedMenuFromKeyboard();
        }
        break;
      case keyCodes.ENTER:
        this.items[this.focusedFieldIndex].handleDropdownOpen(null, null, true);
    }
  }

  renderBackArrow = () => {
    if (!this.props.backButton) return;

    return (
      <DropdownOption
        ref={(opt) => { if (opt !== null) this.items.unshift(opt); }}
        backButton={true}
        fullscreen={this.props.fullscreen}
        onClick={this.props.handleBackClick}
        name={i18n.t('embeddable_framework.navigation.back')} />
    );
  }

  renderOptions = () => {
    return _.map(this.props.options, (option) => {
      return (
        <DropdownOption
          ref={(opt) => { if (opt !== null) this.items.push(opt); }}
          name={option.name}
          key={option.name}
          onClick={option.onClick}
          fullscreen={this.props.fullscreen}
          nestedMenu={option.nestedMenu}
          updateMenu={option.updateMenu} />
      );
    });
  }

  render = () => {
    return (
      <div
        ref={(el) => { this.element = el; }}>
        {this.renderBackArrow()}
        {this.renderOptions()}
      </div>
    );
  }
}
