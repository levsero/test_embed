import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Widget, Header, Main } from 'src/components/Widget'
import OperatingHours from 'src/embeds/chat/components/OperatingHours'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { handleOfflineFormBack } from 'src/redux/modules/chat'
import { getGroupedOperatingHours } from 'src/embeds/chat/selectors'
import { getChatTitle } from 'src/redux/modules/selectors'

const OperatingHoursPage = ({ handleOfflineFormBack, operatingHours, title, locale }) => {
  return (
    <Widget>
      <Header title={title} />
      <Main>
        <OperatingHours
          handleOfflineFormBack={handleOfflineFormBack}
          operatingHours={operatingHours}
          locale={locale}
        />
      </Main>
    </Widget>
  )
}

OperatingHoursPage.propTypes = {
  handleOfflineFormBack: PropTypes.func.isRequired,
  operatingHours: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
}

const actionCreators = { handleOfflineFormBack }

const mapStateToProps = (state) => ({
  operatingHours: getGroupedOperatingHours(state),
  title: getChatTitle(state),
  locale: getLocale(state),
})

const connectedComponent = connect(mapStateToProps, actionCreators)(OperatingHoursPage)

export { connectedComponent as default, OperatingHoursPage as Component }
