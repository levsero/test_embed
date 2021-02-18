import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { i18n } from 'src/apps/webWidget/services/i18n'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import { getOfflineTitle } from 'src/embeds/talk/selectors'
import { Container } from './styles'
import { TEST_IDS } from 'src/constants/shared'

const OfflinePage = ({ message, title }) => (
  <Widget>
    <Header title={title} />
    <Main>
      <Container data-testid={TEST_IDS.TALK_OFFLINE_PAGE}>{message}</Container>
    </Main>
    <Footer />
  </Widget>
)

OfflinePage.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  message: i18n.t('embeddable_framework.talk.offline.label_v2'),
  title: getOfflineTitle(state),
})

const connectedComponent = connect(mapStateToProps)(OfflinePage)

export { connectedComponent as default, OfflinePage as Component }
