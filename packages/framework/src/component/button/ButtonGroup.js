import classNames from 'classnames'
import PropTypes from 'prop-types'
import { locals as styles } from './ButtonGroup.scss'

const ButtonGroup = ({ center, children, className, fullscreen, rtl, style }) => {
  const directionStyles = rtl ? styles.buttonLeft : styles.buttonRight
  const align = center ? styles.buttonCenter : directionStyles
  const buttonDirectionStyles = !fullscreen ? align : ''
  const buttonClasses = classNames(styles.container, buttonDirectionStyles)

  return (
    <div style={style} className={`${buttonClasses} ${className}`}>
      {children}
    </div>
  )
}

ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
  fullscreen: PropTypes.bool,
  rtl: PropTypes.bool,
  style: PropTypes.element,
  className: PropTypes.string,
  center: PropTypes.bool,
}

ButtonGroup.defaultProps = {
  fullscreen: false,
  rtl: false,
  style: null,
  className: '',
  containerClasses: '',
  center: false,
}

export { ButtonGroup }
