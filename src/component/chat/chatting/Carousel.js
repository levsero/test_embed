import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PureCarousel from '../../shared/Carousel';
import StructuredMessage from './StructuredMessage';

export default class Carousel extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    isMobile: PropTypes.bool
  }

  static defaultProps = {
    isMobile: false
  };

  render() {
    const children = this.props.items.map((item, index) => {
      return (
        <StructuredMessage schema={item} key={index} isMobile={this.props.isMobile} inCarousel={true} />
      );
    });

    return (
      <PureCarousel>
        {children}
      </PureCarousel>
    );
  }
}
