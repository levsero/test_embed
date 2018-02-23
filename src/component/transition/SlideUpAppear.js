import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';

export class SlideUpAppear extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    duration: PropTypes.number,
    trigger: PropTypes.bool,
    startPosHeight: PropTypes.string,
    endPosHeight: PropTypes.string
  };

  static defaultProps = {
    className: '',
    duration: 100,
    trigger: true,
    startPosHeight: '-10px',
    endPosHeight: '0'
  };

  render = () => {
    const { duration } = this.props;
    const style = {
      transition: `all ${duration}ms ease-in-out`,
      opacity: 0
    };
    const transitionStyles = {
      entering: {
        opacity: 0,
        bottom: this.props.startPosHeight
      },
      entered: {
        opacity: 1,
        bottom: this.props.endPosHeight
      },
      exiting: {
        opacity: 0,
        bottom: this.props.startPosHeight
      }
    };

    return (
      <Transition in={this.props.trigger} timeout={duration} unmountOnExit={true}>
        {(status) => {
          return (
          <div className={this.props.className} style={{ ...style, ...transitionStyles[status] }}>
            {this.props.children}
          </div>
        );}}
      </Transition>
    );
  }
}
