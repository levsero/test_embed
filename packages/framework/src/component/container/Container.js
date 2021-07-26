import PropTypes from 'prop-types'
import { Component } from 'react'
import { TEST_IDS } from 'src/constants/shared'
import { locals as styles } from './Container.scss'

export class Container extends Component {
  static propTypes = {
    card: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
  }

  static defaultProps = {
    card: false,
    className: '',
    isMobile: false,
    onClick: () => {},
    style: null,
  }

  render = () => {
    const platformClasses = this.props.isMobile ? styles.mobile : styles.desktop
    const styleClasses = this.props.card ? styles.card : ''

    return (
      <div
        role="presentation"
        onClick={this.props.onClick}
        className={`${styles.container} ${this.props.className} ${platformClasses} ${styleClasses}`}
        style={this.props.style}
        data-testid={TEST_IDS.PAGE_CONTAINER}
      >
        {this.props.children}
      </div>
    )
  }
}
