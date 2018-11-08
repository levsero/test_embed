import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {IconButton} from '@zendeskgarden/react-buttons';
import classNames from 'classnames';

import {locals as styles} from './SliderContainer.scss';

import {Icon} from 'component/Icon';
import { getSliderVendor } from 'src/redux/modules/chat/chat-selectors';

const mapStateToProps = (state) => {
  return {
    slider: getSliderVendor(state)
  };
};

export class SliderContainer extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    speed: PropTypes.number,
    variableWidth: PropTypes.bool,
    infinite: PropTypes.bool,
    slidesToScroll: PropTypes.number,
    slidesToShow: PropTypes.number,
    className: PropTypes.string,
    onClick: PropTypes.func,
    slider: PropTypes.func
  }

  static defaultProps = {
    speed: 500,
    variableWidth: false,
    infinite: false,
    slidesToScroll: 1,
    slidesToShow: 1
  }

  constructor(props) {
    super(props);

    this.windowWidth = 0;
    this.childrenWidth = 0;
    this.currentSlide = 0;

    this.isLast = false;
    this.isAnimating = false;

    this.isFocused = false;
    this.isMouseDown = false;

    // Store how much the slick-track has moved to the left
    this.cache = 0;

    // Store all the transition info into pointerArr
    this.pointerArr = [];
  }

  componentDidMount() {
    if (this.props.variableWidth) {
      this.sliderEle = ReactDOM.findDOMNode(this.slider);

      // width of the window where the children can be seen
      this.windowWidth = this.sliderEle.clientWidth;

      // the total width of the children
      this.childrenWidth = this.props.children.reduce((width, child, index) => {
        const slickSliderEle = getParent(this[`child${index}`], 'slick-slide');

        return width += slickSliderEle.clientWidth + getComputedStyle(slickSliderEle, 'marginRight', true);
      }, this.childrenWidth);

      // slick track where the animation takes place
      this.slickTrack = getParent(this.child0, 'slick-track');
    }
  }

  componentDidUpdate() {
    if (this.props.variableWidth) {
      if (this.isLast) {
        // Arrows have to be manually toggled because the "last" flag is
        // calculated outside of the plugin
        hideRightArrow(this.slickTrack);
        showLeftArrow(this.slickTrack);
      }

      // Browser affect the DOM's scrollLeft when we move the carousel manually via tabbing. This will reset scrollLeft behavior.
      getChild(this.sliderEle, 'slick-list').scrollLeft = 0;
    }
  }

  render() {
    const Slider = this.props.slider;

    const pills = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        className: classNames(child.props.className, styles.item),
        ref: (el) => {
          this[`child${index}`] = ReactDOM.findDOMNode(el);
        },
        onMouseDown: () => {
          this.isMouseDown = true;
        },
        onMouseUp: () => {
          this.isMouseDown = true;
        },
        onFocus: () => {
          // Make the element is focused via tab and not click
          if (!this.isMouseDown) {
            // if animation is turned on while tabbing, it will cause bug
            // because the selection will move before the animation is done.
            // Hence, we set a flag to switch off the animation while tabbing.
            this.isFocused = true;
          } else {
            return;
          }

          if (index === 0) {
            this.slider.slickGoTo(0, true);
            this.currentSlide = 0;
            this.isLast = false;
            this.pointerArr = [];
            this.slickTrack.style.transition = '';

            // If immediate scroll reaches the end
            this.slickTrack.style.transform = 'translate3d(0, 0, 0)';
            showRightArrow(this.slickTrack);
          }

          // Check for the current intersecting item
          let totalItemWidth = 0;

          for (let i = 0; i <= index; i++) {
            const itemWidth = calculateChildWidth(this[`child${i}`]);
            const transitedWidth = getTransformX(this.slickTrack);

            if (totalItemWidth + itemWidth > this.windowWidth + transitedWidth) {
              goRight();
            } else {
              totalItemWidth += itemWidth;
            }
          }
        },
        onBlur: () => {
          this.isFocused = false;
        }
      });
    });

    const NextArrow = (props) => {
      const {className, onClick} = props;

      return (
        <IconButton
          size="small"
          className={classNames(styles.sliderButton, styles['sliderButton--right'], className)}
          onClick={(this.props.variableWidth ? goRight : onClick)}
        >
          <Icon type="Icon--chevron-right-fill" />
        </IconButton>
      );
    };
    const PrevArrow = (props) => {
      const {className, onClick} = props;

      return (
        <IconButton
          size="small"
          className={classNames(styles.sliderButton, styles['sliderButton--left'], className)}
          onClick={(this.props.variableWidth ? goLeft : onClick)}
        >
          <Icon type="Icon--chevron-left-fill" />
        </IconButton>
      );
    };

    const goRight = () => {
      if (this.isAnimating) return;

      let totalItemWidth = 0;

      // Calculate intersecting item
      for (let i = 0; i < this.props.children.length; i++) {
        const itemWidth = calculateChildWidth(this[`child${i}`]);
        const transitedWidth = getTransformX(this.slickTrack);

        if (totalItemWidth + itemWidth > this.windowWidth + transitedWidth) {
          // count if remaining item can fit
          const remainingWidth = this.props.children.slice(i).reduce((width, child, index) => {
            return width += calculateChildWidth(this[`child${i + index}`]);
          }, 0);

          // if can fit, slide the remaing items in
          if (remainingWidth <= this.windowWidth) {
            // we also add in the buffer space for focus ring
            const slidingDist = this.childrenWidth - this.windowWidth + 6;

            if (!this.isFocused) {
              this.slickTrack.style.transition = `transform ${this.props.speed}ms ease 0s`;
            }
            this.slickTrack.style.transform = `translate3d(${-(slidingDist)}px, 0, 0)`;

            hideRightArrow(this.slickTrack);

            this.pointerArr.push({
              index: this.currentSlide,
              type: 'width',
              value: -(transitedWidth)
            });

            this.isLast = true;
          } else {
            // else cannot fit, we just scroll to the intersecting item
            this.pointerArr.push({
              index: this.currentSlide
            });
            this.slider.slickGoTo(i, this.isFocused);
            this.currentSlide = i;
          }

          animateLock();

          return;
        } else {
          totalItemWidth += itemWidth;
        }
      }
    };

    const goLeft = () => {
      if (this.isAnimating) return;

      const {index = 0, type = '', value = ''} = this.pointerArr.pop() || {};

      if (type === 'width') {
        if (!this.isFocused) {
          this.slickTrack.style.transition = `transform ${this.props.speed}ms ease 0s`;
        }
        this.slickTrack.style.transform = `translate3d(${value}px, 0, 0)`;
      } else {
        this.slider.slickGoTo(index, this.isFocused);
        this.currentSlide = index;
      }

      animateLock();

      this.isLast = false;
    };

    const animateLock = () => {
      this.isAnimating = (this.isFocused) ? false : true;

      setTimeout(() => {
        this.isAnimating = false;
      }, this.props.speed);
    };

    const sliderSettings = {
      speed: this.props.speed,
      infinite: this.props.infinite,
      variableWidth: this.props.variableWidth,
      slidesToScroll: this.props.slidesToScroll,
      slidesToShow: this.props.slidesToShow,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    };

    return (
      <Slider
        {...sliderSettings}
        ref={(el) => {this.slider = el;}}
        className={(this.props.variableWidth) ? 'variableWidth' : ''}
      >
        {pills}
      </Slider>
    );
  }
}

function hideRightArrow(slickTrack) {
  slickTrack.parentElement.nextSibling.classList.add('slick-disabled');
}

function showRightArrow(slickTrack) {
  slickTrack.parentElement.nextSibling.classList.remove('slick-disabled');
}

function showLeftArrow(slickTrack) {
  slickTrack.parentElement.previousSibling.classList.remove('slick-disabled');
}

/**
 * Get the x translation
 */
function getTransformX(ele) {
  const currentTransform = getComputedStyle(ele, 'transform').replace(/[^0-9\-.,]/g, '').split(',');

  return Math.abs(currentTransform[4]);
}

/**
 * Like traverse parentElement until class is found
 */
function getParent(ele, className, found = false, limit = 10) {
  if (limit === 1 || found) return ele;

  const parent = ele.parentElement;

  if (parent.classList.contains(className)) {
    return getParent(parent, className, true, limit--);
  } else {
    return getParent(parent, className, false, limit--);
  }
}

/**
 * Find immediate child
 */
function getChild(ele, className) {
  return Array.from(ele.children).find((child) =>
    child.classList.contains(className)
  );
}

/**
 * Find window.getComputedStyle and convert to float if neccessary
 */
function getComputedStyle(ele, style, convertToFloat = false) {
  if (convertToFloat) {
    return parseFloat(window.getComputedStyle(ele)[style]);
  }

  return window.getComputedStyle(ele)[style];
}

/**
 * Find the true width of a child element
 */
function calculateChildWidth(child) {
  const slickSlideEle = getParent(child, 'slick-slide');

  return slickSlideEle.clientWidth + getComputedStyle(slickSlideEle, 'margin-right', true);
}

export default connect(mapStateToProps, null, null, {withRef: true})(SliderContainer);
