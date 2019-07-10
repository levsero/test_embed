import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { i18n } from 'service/i18n'
import { locals as styles } from './styles.scss'

const OfflinePage = ({ message }) => {
  return (
    <p className={styles.offline} data-testid="talk--offlinePage">
      {message}
    </p>
  )
}

OfflinePage.propTypes = {
  message: PropTypes.string.isRequired
}

const mapStateToProps = () => ({
  message: i18n.t('embeddable_framework.talk.offline.label')
})

const connectedComponent = connect(mapStateToProps)(OfflinePage)

export { connectedComponent as default, OfflinePage as Component }
