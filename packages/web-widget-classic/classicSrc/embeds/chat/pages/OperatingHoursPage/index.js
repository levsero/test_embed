import { Widget, Header, Main } from 'classicSrc/components/Widget'
import OperatingHours from 'classicSrc/embeds/chat/components/OperatingHours'
import { getGroupedOperatingHours } from 'classicSrc/embeds/chat/selectors'
import { getLocale } from 'classicSrc/redux/modules/base/base-selectors'
import { handleOfflineFormBack } from 'classicSrc/redux/modules/chat'
import { getChatTitle } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

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
