import React from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './styles.scss'
import { TEST_IDS } from 'src/constants/shared'

const WidgetMain = ({ children }) => (
  <div data-testid={TEST_IDS.WIDGET_MAIN_CONTENT} className={styles.container}>
    {children}
  </div>
)

WidgetMain.propTypes = {
  children: PropTypes.node
}

WidgetMain.defaultProps = {
  children: []
}

export default WidgetMain
