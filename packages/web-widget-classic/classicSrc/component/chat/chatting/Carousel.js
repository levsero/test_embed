import PureCarousel from 'classicSrc/embeds/chat/components/Carousel'
import PropTypes from 'prop-types'
import { Component } from 'react'
import StructuredMessage from './StructuredMessage'

export default class Carousel extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    isMobile: PropTypes.bool,
  }

  static defaultProps = {
    isMobile: false,
  }

  render() {
    const children = this.props.items.map((item, index) => {
      return (
        <StructuredMessage
          schema={item}
          key={index}
          isMobile={this.props.isMobile}
          inCarousel={true}
        />
      )
    })

    return <PureCarousel isMobile={this.props.isMobile}>{children}</PureCarousel>
  }
}
