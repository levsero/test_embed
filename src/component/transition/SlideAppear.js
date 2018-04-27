import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';

const DIRECTION_MAP = {
  UP: 'bottom',
  DOWN: 'top'
};

export class SlideAppear extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    direction: PropTypes.string,
    duration: PropTypes.number,
    trigger: PropTypes.bool,
    startPosHeight: PropTypes.string,
    endPosHeight: PropTypes.string,
    onClick: PropTypes.func,
    onExited: PropTypes.func
  };

  static defaultProps = {
    className: '',
    direction: 'up',
    duration: 100,
    trigger: true,
    startPosHeight: '0',
    endPosHeight: '10px',
    onClick: () => {},
    onExited: () => {}
  };

  render = () => {
    const { duration } = this.props;
    const direction = this.props.direction.toUpperCase();
    const position = DIRECTION_MAP[direction] || DIRECTION_MAP.UP;
    const style = {
      transition: `all ${duration}ms ease-in-out`,
      opacity: 0
    };
    const transitionStyles = {
      entering: {
        opacity: 0,
        [position]: this.props.startPosHeight
      },
      entered: {
        opacity: 1,
        [position]: this.props.endPosHeight
      },
      exiting: {
        opacity: 0,
        [position]: this.props.startPosHeight
      }
    };

    return (
      <Transition in={this.props.trigger} timeout={duration} unmountOnExit={true} onExited={this.props.onExited}>
        {(status) => {
          return (
            <div onClick={this.props.onClick}
              className={this.props.className}
              style={{ ...style, ...transitionStyles[status] }}>
              {this.props.children}
            </div>
          );}}
      </Transition>
    );
  }
}
