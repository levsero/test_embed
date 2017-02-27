import React, { Component, PropTypes } from 'react';

import { locals as styles } from './DropdownOption.sass';

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

    return <div className={`${styles.arrowNext} ${arrowMobileClasses}`} />;
  }

  renderBackArrow = () => {
    if (!this.props.backButton) return;

    const arrowMobileClasses = this.props.fullscreen ? styles.arrowMobile : '';

    return (
      <div className={`${styles.arrowBack} ${arrowMobileClasses}`} />
    );
  }

  render = () => {
    const focusedClasses = this.state.focused ? styles.fieldFocused : '';

    return (
      <div
        ref={(el) => { this.element = el; }}
        className={`${styles.field} ${focusedClasses}`}
        key={this.props.title}
        onClick={this.handleDropdownOpen}>
        <div>
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
