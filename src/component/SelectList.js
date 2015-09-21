import React from 'react';

import { Icon } from 'component/Icon';

export const SelectList = React.createClass({
  getDefaultProps() {
    return {
      options: [],
      selectedItem: 0,
      highlightColor: '',
      wrapperClassNames: '',
      selectClassNames: '',
      iconClassNames: '',
    };
  },

  render() {
    /* jshint laxbreak: true */
    const optionsList = this.props.options.map(
      (label) => {
        return this.props.selectedItem === label
             ? <option value={label} selected>{label}</option>
             : <option value={label}>{label}</option>;
      }
    );

    return (
      <div className={`${this.props.wrapperClassNames} SelectListContainer`}>
        <select
          className={this.props.selectClassNames}
          style={{ color: this.props.highlightColor }}>
          {optionsList}
        </select>
        <span className={this.props.iconClassNames}>
          <Icon type='Icon--caret' />
        </span>
      </div>
    );
  }
});
