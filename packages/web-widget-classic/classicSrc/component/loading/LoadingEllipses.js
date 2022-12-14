import { TEST_IDS } from 'classicSrc/constants/shared'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { isDevice } from '@zendesk/widget-shared-services'
import { locals as styles } from './LoadingEllipses.scss'

export class LoadingEllipses extends Component {
  static propTypes = {
    className: PropTypes.string,
    itemClassName: PropTypes.string,
    useUserColor: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    itemClassName: '',
    useUserColor: true,
  }

  render = () => {
    // On IOS8 iphone the scale animation crashes the webpage so
    // we need to animate differently.
    const isIos8 = isDevice('iPhone', 'OS 8')
    const { className, useUserColor, itemClassName } = this.props
    const containerClass = `${styles.container} ${className}`
    const itemClasses = `${styles.circle} ${itemClassName}`
    const animationStyle = isIos8 ? styles.fade : styles.bounce
    const userColorStyle = useUserColor ? 'u-userBackgroundColor' : ''
    const ellipsesItemClasses = `
      ${itemClasses}
      ${animationStyle}
      ${userColorStyle}
    `

    return (
      <div
        className={containerClass}
        aria-busy="true"
        aria-live="polite"
        data-testid={TEST_IDS.ICON_ELLIPSIS}
      >
        <div className={ellipsesItemClasses} />
        <div className={ellipsesItemClasses} />
        <div className={ellipsesItemClasses} />
      </div>
    )
  }
}
