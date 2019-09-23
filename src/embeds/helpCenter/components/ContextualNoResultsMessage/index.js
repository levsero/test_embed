import React from 'react'
import { locals as styles } from './styles.scss'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { i18n } from 'service/i18n'

const ContextualNoResultsMessage = ({ isMobile }) => {
  const searchBarStyles = classNames({
    [styles.useSearchBarTextMobile]: isMobile,
    [styles.useSearchBarTextDesktop]: !isMobile
  })
  const containerStyles = classNames(styles.contextualNoResults, {
    [styles.contextualNoResultsMobile]: isMobile
  })

  return (
    <div className={containerStyles}>
      <p className={searchBarStyles}>
        {i18n.t('embeddable_framework.helpCenter.content.useSearchBar')}
      </p>
    </div>
  )
}

ContextualNoResultsMessage.propTypes = {
  isMobile: PropTypes.bool
}

export default ContextualNoResultsMessage
