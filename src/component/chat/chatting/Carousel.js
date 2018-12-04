import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PureCarousel from '../../shared/Carousel';
import StructuredMessage from './StructuredMessage';

import { locals as styles } from './Carousel.scss';

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
      const panelClasses = classNames(styles.panel, {
        [styles.panelMobile]: this.props.isMobile,
      });

      return (
        <StructuredMessage schema={item} key={index} className={panelClasses}/>
      );
    });

    return (
      <PureCarousel>
        {children}
      </PureCarousel>
    );
  }
}
