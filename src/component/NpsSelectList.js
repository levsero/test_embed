import React from 'react/addons';

import { Icon } from 'component/Icon';

class NpsSelectList extends React.Component {
  render() {
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
          <Icon type='Icon--caret' />
        </span>
      </div>
    );
  }
}

NpsSelectList.defaultProps = {
  options: [],
  selectedItem: 0,
  highlightColor: '',
  wrapperClassNames: '',
  selectClassNames: '',
  iconClassNames: '',
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

export { NpsSelectList };