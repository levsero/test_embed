import React from 'react'
import { locals as styles } from './styles.scss'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { i18n } from 'service/i18n'

const Legend = ({ hasContextuallySearched, fullscreen }) => {
  const containerClasses = classNames(styles.container, {
    [styles.containerMobile]: fullscreen
  })
  const message = hasContextuallySearched
    ? i18n.t('embeddable_framework.helpCenter.label.topSuggestions')
    : i18n.t('embeddable_framework.helpCenter.label.results')
  return (
    <div className={containerClasses}>
      <h2 className={styles.content}>{message}</h2>
    </div>
  )
}

Legend.propTypes = {
  fullscreen: PropTypes.bool,
  hasContextuallySearched: PropTypes.bool
}

export default Legend
