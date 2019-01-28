import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { locals as styles } from './Carousel.scss';

import Slider from '../SliderContainer';

export default class Carousel extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    isMobile: PropTypes.bool
  }

  static defaultProps = {
    isMobile: false
  };

  constructor(props) {
    super(props);
  }

  render= () => {
    const containerClassName = classNames('structuredMessageSlider', styles.carouselSlider);
    const sliderSettings = {
      arrows: !(this.props.isMobile)
    };

    return (
      <div className={containerClassName}>
        <Slider {...sliderSettings}>
          {this.props.children}
        </Slider>
      </div>
    );
  }
}
