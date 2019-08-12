import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { i18n } from 'service/i18n'
import { locals as styles } from './styles.scss'

import WidgetContainer from 'src/components/WidgetContainer'
import WidgetHeader from 'src/components/WidgetHeader'
import WidgetMain from 'src/components/WidgetMain'
import WidgetFooter from 'src/components/WidgetFooter'
import ZendeskLogo from 'src/components/ZendeskLogo'
import { getOfflineTitle } from 'src/embeds/talk/selectors'

const OfflinePage = ({ message, title }) => {
  return (
    <WidgetContainer>
      <WidgetHeader>{title}</WidgetHeader>
      <WidgetMain>
        <p className={styles.offline} data-testid="talk--offlinePage">
          {message}
        </p>
      </WidgetMain>
      <WidgetFooter>
        <ZendeskLogo />
      </WidgetFooter>
    </WidgetContainer>
  )
}

OfflinePage.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  message: i18n.t('embeddable_framework.talk.offline.label'),
  title: getOfflineTitle(state)
})

const connectedComponent = connect(mapStateToProps)(OfflinePage)

export { connectedComponent as default, OfflinePage as Component }
