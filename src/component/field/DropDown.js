import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export class Dropdown extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    value: PropTypes.string
  }

  constructor (props) {
    super(props);
    this.state = {
      selected: props.value || {
        title: props.placeholder || 'Select...',
        value: ''
      },
      isOpen: false
    };
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.value && newProps.value !== this.state.selected) {
      this.setState({selected: newProps.value});
    } else if (!newProps.value && newProps.placeholder) {
      this.setState({selected: { title: newProps.placeholder, value: '' }});
    }
  }

  handleMouseDown = (event) => {
    if (event.type === 'mousedown' && event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();

    if (!this.props.disabled) {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }

  setValue = (value, title) => {
    let newState = {
      selected: { value, title },
      isOpen: false
    };

    this.fireChangeEvent(newState);
    this.setState(newState);
  }

  fireChangeEvent (newState) {
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected);
    }
  }

  renderOption = (option) => {
    let value = option.value || option.title || option;
    let title = option.title || option.value || option;

    return (
      <div
        key={value}
        className='u-border u-paddingAS'
        onMouseDown={this.setValue.bind(this, value, title)}
        onClick={this.setValue.bind(this, value, title)}>
        {title}
      </div>
    );
  }

  buildMenu = () => {
    let { options } = this.props;
    let ops = options.map((option) => {
      if (option.type === 'group') {
        let groupTitle = (<div className={''}>{option.name}</div>);
        let _options = option.items.map((item) => this.renderOption(item));

        return (
          <div className='u-border u-paddingAS' key={option.name}>
            {groupTitle}
            {_options}
          </div>
        );
      } else {
        return this.renderOption(option);
      }
    });

    return ops.length ? ops : <div className={`noresults`}>No options found</div>;
  }

  render = () => {
    const disabledClass = this.props.disabled ? 'Dropdown-disabled' : '';
    const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.title;
    let value = (<div className={`placeholder`}>{placeHolderValue}</div>);
    let menu = this.state.isOpen ? <div className={`menu`}>{this.buildMenu()}</div> : null;

    let dropdownClass = classNames({
      'u-border u-paddingAS': true,
      'is-open': this.state.isOpen
    });

    return (
      <div className={dropdownClass}>
        <div
          className={`control ${disabledClass}`}
          onMouseDown={this.handleMouseDown.bind(this)}
          onTouchEnd={this.handleMouseDown.bind(this)}>
          {value}
          <span className={`arrow`} />
        </div>
        {menu}
      </div>
    );
  }
}
