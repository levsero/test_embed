import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'component/Icon';

export class NpsSelectList extends Component {
  static propTypes = {
    highlightColor: PropTypes.string,
    iconClassNames: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    options: PropTypes.array,
    selectClassNames: PropTypes.string,
    selectedItem: PropTypes.number,
    wrapperClassNames: PropTypes.string
  };

  static defaultProps = {
    highlightColor: '',
    iconClassNames: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    options: [],
    selectClassNames: '',
    selectedItem: 0,
    wrapperClassNames: ''
  };

  render = () => {
    const optionsList = this.props.options.map(
      (label, i) => {
        return (this.props.selectedItem === label)
             ? <option key={i} value={label} selected={true}>{label}</option>
             : <option key={i} value={label}>{label}</option>;
      }
    );

    return (
      <div className='u-inline u-posRelative NpsSelectListContainer'>
        <select
          onFocus={this.props.onFocus}
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
          className='NpsComment-selectlist u-textSizeBaseMobile'
          style={{ color: this.props.highlightColor }}>
          {optionsList}
        </select>
        <span className='NpsComment-selectlist-icon u-posAbsolute u-posStart--vertFlush'>
          <Icon type='Icon--chevron' />
        </span>
      </div>
    );
  }
}
