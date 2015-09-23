import React from 'react/addons';

import { Icon } from 'component/Icon';

export const NpsSelectList = React.createClass({
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
      (label, i) => {
        return (this.props.selectedItem === label)
             ? <option key={i} value={label} selected>{label}</option>
             : <option key={i} value={label}>{label}</option>;
      }
    );

    return (
      <div className='u-inline u-posRelative NpsSelectListContainer'>
        <select
          onClick={this.scrollHacks}
          className='NpsComment-selectlist'
          style={{ color: this.props.highlightColor }}>
          {optionsList}
        </select>
        <span className='NpsComment-selectlist-icon'>
          <Icon type='Icon--caret' />
        </span>
      </div>
    );
  }
});
