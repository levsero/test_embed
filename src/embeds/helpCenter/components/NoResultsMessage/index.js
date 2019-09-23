import React from 'react'
import { locals as styles } from './styles.scss'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { i18n } from 'service/i18n'

const Message = ({ isMobile, title, body }) => {
  const containerClasses = classNames(styles.noResults, {
    [styles.noResultsMobile]: isMobile,
    [styles.noResultsDesktop]: !isMobile
  })
  const paragraphClasses = classNames(styles.noResultsParagraph, {
    [styles.noResultsParagraphDesktop]: !isMobile
  })

  return (
    <div className={containerClasses}>
      <p className={styles.title}>{title}</p>
      <p className={paragraphClasses}>{body}</p>
    </div>
  )
}

Message.propTypes = {
  isMobile: PropTypes.bool,
  title: PropTypes.string,
  body: PropTypes.string
}

const NoResultsMessage = ({ isMobile, searchFailed, showNextButton, previousSearchTerm }) => {
  const title = searchFailed
    ? i18n.t('embeddable_framework.helpCenter.search.error.title')
    : i18n.t('embeddable_framework.helpCenter.search.noResults.title', {
        searchTerm: previousSearchTerm
      })
  const body =
    searchFailed && showNextButton
      ? i18n.t('embeddable_framework.helpCenter.search.error.body')
      : i18n.t('embeddable_framework.helpCenter.search.noResults.body')

  return <Message title={title} body={body} isMobile={isMobile} />
}

NoResultsMessage.propTypes = {
  isMobile: PropTypes.bool,
  searchFailed: PropTypes.bool,
  showNextButton: PropTypes.bool,
  previousSearchTerm: PropTypes.string
}

export default NoResultsMessage
