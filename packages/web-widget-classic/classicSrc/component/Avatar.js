import { Icon } from 'classicSrc/component/Icon'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { locals as styles } from './Avatar.scss'

export class Avatar extends Component {
  static propTypes = {
    className: PropTypes.string,
    src: PropTypes.string,
    fallbackIcon: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    src: '',
  }

  renderCustom = (classes) => {
    return <img aria-hidden={true} alt="avatar" className={classes} src={this.props.src} />
  }

  renderDefault = (classes, icon) => {
    return <Icon className={classes} type={icon} />
  }

  render = () => {
    const { src, className, fallbackIcon } = this.props
    const classes = `${styles.avatar} ${className}`

    return _.isEmpty(src) ? this.renderDefault(classes, fallbackIcon) : this.renderCustom(classes)
  }
}
