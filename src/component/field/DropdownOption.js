import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { locals as styles } from './DropdownOption.sass';
import { i18n } from 'service/i18n';

export class DropdownOption extends Component {
  static propTypes = {
    backButton: PropTypes.bool,
    fullscreen: PropTypes.bool,
    name: PropTypes.string,
    nestedMenu: PropTypes.object,
    onClick: PropTypes.func,
    updateMenu: PropTypes.func,
    nameFormat: PropTypes.func
  }

  static defaultProps = {
    backButton: false,
    fullscreen: false,
    nestedMenu: null,
    name: '',
    onClick: () => {},
    updateScreen: () => {},
    nameFormat: _.identity
  }

  constructor (props) {
    super(props);

    this.state = {
      focused: false
    };

    this.element = null;
  }

  handleDropdownOpen = (e, __, fromKeyboard = false) => {
    if (this.props.nestedMenu !== null) {
      this.props.updateMenu(this.props.nestedMenu, fromKeyboard);
    } else {
      this.props.onClick(fromKeyboard);
    }
  }

  openNestedMenuFromKeyboard = () => {
    if (this.props.nestedMenu !== null) {
      this.props.updateMenu(this.props.nestedMenu, true);
    }
  }

  focus = () => {
    this.setState({ focused: true });
  }

  blur = () => {
    this.setState({ focused: false });
  }

  renderNextArrow = () => {
    if (this.props.nestedMenu === null) return;

    const arrowMobileClasses = this.props.fullscreen ? styles.arrowMobile : '';
    const arrow = i18n.isRTL() ? styles.arrowLeft : styles.arrowRight;

    return <div className={`${arrow} ${arrowMobileClasses}`} />;
  }

  renderBackArrow = () => {
    if (!this.props.backButton) return;

    const arrowMobileClasses = this.props.fullscreen ? styles.arrowMobile : '';
    const arrow = i18n.isRTL() ? styles.arrowRight : styles.arrowLeft;

    return (
      <div className={`${arrow} ${arrowMobileClasses}`} />
    );
  }

  renderName = () => {
    const { nameFormat, name } = this.props;

    return nameFormat(name);
  }

  render = () => {
    const focusedClasses = this.state.focused ? styles.fieldFocused : '';
    const borderClasses = this.props.backButton ? styles.fieldBorder : '';

    return (
      <div
        ref={(el) => { this.element = el; }}
        className={borderClasses}
        key={this.props.name}
        onClick={this.handleDropdownOpen}>
        <div className={`${styles.field} ${focusedClasses}`}>
          {this.renderBackArrow()}
          <div className={styles.name}>
            {this.renderName()}
          </div>
          {this.renderNextArrow()}
        </div>
      </div>
    );
  }
}
