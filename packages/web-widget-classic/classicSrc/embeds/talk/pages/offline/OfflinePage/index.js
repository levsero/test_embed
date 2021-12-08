import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { Widget, Header, Main, Footer } from 'classicSrc/components/Widget'
import { TEST_IDS } from 'classicSrc/constants/shared'
import { getOfflineTitle } from 'classicSrc/embeds/talk/selectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container } from './styles'

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
