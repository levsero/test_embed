import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@zendeskgarden/react-buttons';
import classNames from 'classnames';

import { locals as styles } from './QuickReplies.scss';

import { SliderContainer as Slider } from '../SliderContainer';

export class QuickReply extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func
  }

  static defaultProps = {
    onClick: () => {}
  }

  render = () => {
    const className = classNames(this.props.className, styles.quickReply);

    return (
      <Button
        className={className}
        pill={true}
        onClick={this.props.onClick}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
      >
        {this.props.label}
      </Button>
    );
  }
}

export class QuickReplies extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      useCarousel: false
    };
  }

  componentDidMount() {
    if (this.container.scrollWidth > this.container.clientWidth) {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({
        useCarousel: true
      });
    }
  }

  render = () => {
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        className: classNames(child.props.className, styles.item),
      })
    );

    const containerStyle = classNames({
      [styles.container]: true,
      'structuredMessageSlider': true,
      [styles.scroll]: !this.state.useCarousel,
      [styles.slider]: this.state.useCarousel,
    });

    const sliderSettings = {
      variableWidth: true,
      speed: 300
    };

    if (this.state.useCarousel) {
      return (
        <div className={containerStyle}>
          <Slider {...sliderSettings}>
            {children}
          </Slider>
        </div>
      );
    } else {
      return (
        <div className={containerStyle} ref={(el) => {this.container = el;}}>
          {children}
        </div>
      );
    }
  }
}
