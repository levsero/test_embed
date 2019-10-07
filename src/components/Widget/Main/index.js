import React from 'react'
import PropTypes from 'prop-types'
import { TEST_IDS } from 'constants/shared'
import { locals as styles } from './styles.scss'

const Main = ({ children }) => (
  <div data-testid={TEST_IDS.WIDGET_MAIN_CONTENT} className={styles.container}>
    {children}
  </div>
)

Main.propTypes = {
  children: PropTypes.node
}

Main.defaultProps = {
  children: []
}

export default Main
