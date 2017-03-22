import React, { Component, PropTypes } from 'react';

import { locals as styles } from './DropdownOption.sass';
import { i18n } from 'service/i18n';

export class DropdownOption extends Component {
  static propTypes = {
    backButton: PropTypes.bool,
    fullscreen: PropTypes.bool,
    title: PropTypes.string,
    nestedMenu: PropTypes.object,
    onClick: PropTypes.func,
    updateMenu: PropTypes.func
  }

  static defaultProps = {
    backButton: false,
    fullscreen: false,
    nestedMenu: null,
    title: '',
    onClick: () => {},
    updateScreen: () => {}
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

  render = () => {
    const focusedClasses = this.state.focused ? styles.fieldFocused : '';
    const borderClasses = this.props.backButton ? styles.fieldBorder : '';

    return (
      <div
        ref={(el) => { this.element = el; }}
        className={borderClasses}
        key={this.props.title}
        onClick={this.handleDropdownOpen}>
        <div className={`${styles.field} ${focusedClasses}`}>
          {this.renderBackArrow()}
          <div className={styles.title}>
            {this.props.title}
          </div>
          {this.renderNextArrow()}
        </div>
      </div>
    );
  }
}
