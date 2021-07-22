import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Children, cloneElement, Component } from 'react'
import { Button } from '@zendeskgarden/react-buttons'
import Slider from 'embeds/chat/components/SliderContainer'
import { locals as styles } from './QuickReplies.scss'

export class QuickReply extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
  }

  static defaultProps = {
    onClick: () => {},
  }

  render = () => {
    const className = classNames(this.props.className, styles.quickReply)

    return (
      <Button
        className={className}
        isPill={true}
        onClick={this.props.onClick}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
      >
        {this.props.label}
      </Button>
    )
  }
}

export class QuickReplies extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    isMobile: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      useCarousel: false,
    }
  }

  componentDidMount() {
    if (this.props.isMobile) return

    if (this.container.scrollWidth > this.container.clientWidth) {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({
        useCarousel: true,
      })
    }
  }

  /**
   * Stop scroll propagation to prevent scroll callback in ScrollContainer
   * from  firing
   */
  stopScrollingPropagation(e) {
    e.stopPropagation()
    return
  }

  render = () => {
    // Give each child a margin but not the last child
    const children = Children.map(this.props.children, (child, idx) => {
      const lastChildIndex = this.props.children.length - 1

      return cloneElement(child, {
        className: classNames({
          [styles.separator]: idx !== lastChildIndex,
          [styles.lastSeparator]: idx === lastChildIndex,
        }),
      })
    })

    const containerStyle = classNames({
      [styles.container]: true,
      structuredMessageSlider: true,
      [styles.mobile]: this.props.isMobile,
    })

    const sliderSettings = {
      variableWidth: true,
      speed: 300,
    }

    if (this.state.useCarousel) {
      return (
        <div className={containerStyle}>
          <Slider {...sliderSettings}>{children}</Slider>
        </div>
      )
    } else {
      return (
        <div
          className={containerStyle}
          ref={(el) => {
            this.container = el
          }}
          onScroll={this.stopScrollingPropagation}
        >
          <div className={styles.scroll}>{children}</div>
        </div>
      )
    }
  }
}
