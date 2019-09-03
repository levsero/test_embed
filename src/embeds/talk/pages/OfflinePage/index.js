import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { i18n } from 'service/i18n'
import WidgetContainer from 'src/components/WidgetContainer'
import WidgetHeader from 'src/components/WidgetHeader'
import WidgetMain from 'src/components/WidgetMain'
import WidgetFooter from 'src/components/WidgetFooter'
import ZendeskLogo from 'src/components/ZendeskLogo'
import { getOfflineTitle } from 'src/embeds/talk/selectors'
import { getHideZendeskLogo } from 'src/redux/modules/selectors'
import { Container } from './styles'

const OfflinePage = ({ message, title, hideZendeskLogo }) => {
  return (
    <WidgetContainer>
      <WidgetHeader>{title}</WidgetHeader>
      <WidgetMain>
        <Container data-testid="talk--offlinePage">{message}</Container>
      </WidgetMain>
      <WidgetFooter>{hideZendeskLogo ? null : <ZendeskLogo />}</WidgetFooter>
    </WidgetContainer>
  )
}

OfflinePage.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  hideZendeskLogo: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  message: i18n.t('embeddable_framework.talk.offline.label_v2'),
  title: getOfflineTitle(state),
  hideZendeskLogo: getHideZendeskLogo(state)
})

const connectedComponent = connect(mapStateToProps)(OfflinePage)

export { connectedComponent as default, OfflinePage as Component }
