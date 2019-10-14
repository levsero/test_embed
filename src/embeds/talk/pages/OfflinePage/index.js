import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { i18n } from 'service/i18n'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import ZendeskLogo from 'src/components/ZendeskLogo'
import { getOfflineTitle } from 'src/embeds/talk/selectors'
import { getHideZendeskLogo } from 'src/redux/modules/selectors'
import { Container } from './styles'
import { TEST_IDS } from 'src/constants/shared'

const OfflinePage = ({ message, title, hideZendeskLogo }) => (
  <Widget>
    <Header title={title} />
    <Main>
      <Container data-testid={TEST_IDS.TALK_OFFLINE_PAGE}>{message}</Container>
    </Main>
    <Footer>{hideZendeskLogo ? null : <ZendeskLogo />}</Footer>
  </Widget>
)

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
