import React from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './styles.scss'
import classNames from 'classnames'
import { TEST_IDS } from 'constants/shared'

const Main = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    data-testid={TEST_IDS.WIDGET_MAIN_CONTENT}
    className={classNames(styles.container, className)}
    ref={ref}
  />
))

Main.propTypes = {
  className: PropTypes.string
}

export default Main
