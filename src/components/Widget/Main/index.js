import React from 'react'
import { TEST_IDS } from 'constants/shared'
import { locals as styles } from './styles.scss'

const Main = ({ ...props }) => (
  <div {...props} data-testid={TEST_IDS.WIDGET_MAIN_CONTENT} className={styles.container} />
)

export default Main
