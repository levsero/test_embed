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

    this.currentPageIndex = 0;

    /**
     * @typedef {Object} PageInfo
     * @property {boolean} canGoToPrevPage indicates whether it is possible to go to the previous page
     * @property {boolean} canGoToNextPage indicates whether it is possible to go to the next page
     * @property {number} cssTransformVal value of CSS transform to go to the page
     */

    /**
     * List of the slider's pages info. The list item index will correspond
     * to the a page position (i.e. item index `1` will have the value of
     * the second page's info).
     * @type {Array.<PageInfo>}
     */
    this.pages = [];

    /**
     * Map an item index to the page index where the item is in
     * @type {Object.<number, number>}
     */
    this.itemIndexToPageIndex = {};

    this.isAnimating = false;

    this.isFocused = false;
    this.isMouseDown = false;
  }

  componentDidMount() {
    if (this.props.variableWidth) {
      this.sliderEle = ReactDOM.findDOMNode(this.slider);

      this.calculatePagesInfo();

      // slick track where the animation takes place
      this.slickTrack = getParent(this.child0, 'slick-track');
    }
  }

  componentDidUpdate() {
    if (this.props.variableWidth) {
      // when slider arrow is clicked, the component is re-rendered
      // (due to parent component re-render) which caused the arrows
      // to go back to original state (i.e. prev arrow hidden and next
      // arrow shown). Updating the slider arrows here to make sure
      // that the arrows are in the correct state.
      this.updateSliderArrows(this.currentPageIndex);

      // Browser affect the DOM's scrollLeft when we move the carousel manually via tabbing. This will reset scrollLeft behavior.
      getChild(this.sliderEle, 'slick-list').scrollLeft = 0;
    }
  }

  calculatePagesInfo() {
    // width of the window where the children can be seen
    const windowWidth = this.sliderEle.clientWidth;

    let currPageWidth = 0;
    let currPageIndex = 0;
    let prevSiblingsWidth = 0; // total width of the previous siblings

    this.pages.push({
      canGoToPrevPage: false,
      canGoToNextPage: true,
      cssTransformVal: 0
    });

    for (let itemIndex = 0; itemIndex < this.props.children.length; itemIndex++) {
      const itemWidth = calculateChildWidth(this[`child${itemIndex}`]);

      currPageWidth += itemWidth;

      if (currPageWidth <= windowWidth) {
        this.itemIndexToPageIndex[itemIndex] = currPageIndex;
      } else {
        this.itemIndexToPageIndex[itemIndex] = ++currPageIndex;

        this.pages.push({
          canGoToPrevPage: true,
          canGoToNextPage: true,
          cssTransformVal: prevSiblingsWidth
        });

        currPageWidth = itemWidth;
      }

      prevSiblingsWidth += itemWidth;
    }

    const lastPage = this.pages[this.pages.length - 1];

    lastPage.canGoToNextPage = false;
    lastPage.cssTransformVal = prevSiblingsWidth - windowWidth;
  }

  goTo = (pageIndex) => {
    if (
      pageIndex === this.currentPageIndex
      || this.isAnimating
      || pageIndex < 0
      || pageIndex >= this.pages.length
    ) {
      return;
    }

    if (this.props.variableWidth) {
      const {
        cssTransformVal
      } = this.pages[pageIndex];

      this.slickTrack.style.transition = this.isFocused ? '' : `transform ${this.props.speed}ms ease 0s`;
      this.slickTrack.style.transform = `translate3d(${-(cssTransformVal)}px, 0, 0)`;

      this.updateSliderArrows(pageIndex);
      this.animateLock();
    } else {
      this.slider.slickGoTo(pageIndex, this.isFocused);
    }

    this.currentPageIndex = pageIndex;
  }

  updateSliderArrows = (pageIndex) => {
    const {
      canGoToPrevPage,
      canGoToNextPage
    } = this.pages[pageIndex];

    if (canGoToPrevPage) {
      showPrevArrow(this.slickTrack);
    } else {
      hidePrevArrow(this.slickTrack);
    }

    if (canGoToNextPage) {
      showNextArrow(this.slickTrack);
    } else {
      hideNextArrow(this.slickTrack);
    }
  }

  goNext = () => {
    this.goTo(this.currentPageIndex + 1);
  }

  goPrev = () => {
    this.goTo(this.currentPageIndex - 1);
  }

  animateLock = () => {
    this.isAnimating = !this.isFocused;

    setTimeout(() => {
      this.isAnimating = false;
    }, this.props.speed);
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

          const pageIndex = this.itemIndexToPageIndex[index];

          this.goTo(pageIndex);
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
          onClick={(this.props.variableWidth ? this.goNext : onClick)}
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
          onClick={(this.props.variableWidth ? this.goPrev : onClick)}
        >
          <Icon type="Icon--chevron-left-fill" />
        </IconButton>
      );
    };

    const sliderSettings = {
      speed: this.props.speed,
      infinite: this.props.infinite,
      variableWidth: this.props.variableWidth,
      slidesToScroll: this.props.slidesToScroll,
      slidesToShow: this.props.slidesToShow,
      draggable: false,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />
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

function hideNextArrow(slickTrack) {
  slickTrack.parentElement.nextSibling.classList.add('slick-disabled');
}

function hidePrevArrow(slickTrack) {
  slickTrack.parentElement.previousSibling.classList.add('slick-disabled');
}

function showNextArrow(slickTrack) {
  slickTrack.parentElement.nextSibling.classList.remove('slick-disabled');
}

function showPrevArrow(slickTrack) {
  slickTrack.parentElement.previousSibling.classList.remove('slick-disabled');
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
