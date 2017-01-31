import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { locals as styles } from './DropdownOption.sass';

export class DropdownOption extends Component {
  static propTypes = {
    title: PropTypes.string,
    nestedOptions: PropTypes.array,
    onClick: PropTypes.func,
    updateScreen: PropTypes.func
  }

  constructor (props) {
    super(props);
  }

  handleDropdownOpen = () => {
    if (this.props.nestedOptions !== null) {
      // this.setState({ isOpen: !this.state.isOpen });
      this.props.updateScreen(this.props.nestedOptions, this.props.title);
    } else {
      this.props.onClick();
    }
  }

  renderNextArrow = () => {
    return <div className={styles.arrowNext}></div>;
  }


  render = () => {
    const hasNestedFields = this.props.nestedOptions !== null;
    const arrow = hasNestedFields ? this.renderNextArrow() : '';

    return (
      <div className={styles.field} key={this.props.title} onClick={this.handleDropdownOpen}>
        <div>{this.props.title} {arrow}</div>
      </div>
    );
  }
}
