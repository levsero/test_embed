import { TEST_IDS } from 'classicSrc/constants/shared'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { locals as styles } from './LoadingSpinner.scss'

export class LoadingSpinner extends Component {
  static propTypes = {
    className: PropTypes.string,
    circleClasses: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    viewBox: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    circleClasses: '',
    height: 100,
    width: 100,
    viewBox: '0 0 180 180',
  }

  render = () => {
    const { className, circleClasses, width, height, viewBox } = this.props
    const circleStyles = `u-userStrokeColor ${styles.circle} ${circleClasses}`

    return (
      <svg
        className={`${styles.spinner} ${className}`}
        width={width}
        height={height}
        viewBox={viewBox}
        data-testid={TEST_IDS.LOADING_SPINNER}
      >
        <circle className={circleStyles} cx="90" cy="90" r="70" />
      </svg>
    )
  }
}
