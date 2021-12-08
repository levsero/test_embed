import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isMobileBrowser } from '@zendesk/widget-shared-services'
import ContextualNoResultsMessage from 'src/embeds/helpCenter/components/ContextualNoResultsMessage'
import NoResultsMessage from 'src/embeds/helpCenter/components/NoResultsMessage'
import {
  getSearchFailed,
  getPreviousSearchTerm,
  shouldShowContextualResults,
} from 'src/embeds/helpCenter/selectors'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { getShowNextButton } from 'src/redux/modules/selectors'

const NoResults = ({
  isMobile,
  searchFailed,
  previousSearchTerm,
  showNextButton,
  locale,
  shouldShowContextualResults,
}) => {
  return shouldShowContextualResults ? (
    <ContextualNoResultsMessage locale={locale} isMobile={isMobile} />
  ) : (
    <NoResultsMessage
      isMobile={isMobile}
      searchFailed={searchFailed}
      previousSearchTerm={previousSearchTerm}
      showNextButton={showNextButton}
      locale={locale}
    />
  )
}

NoResults.propTypes = {
  isMobile: PropTypes.bool,
  searchFailed: PropTypes.bool,
  previousSearchTerm: PropTypes.string,
  showNextButton: PropTypes.bool,
  locale: PropTypes.string,
  shouldShowContextualResults: PropTypes.bool,
}

NoResults.defaultProps = {
  isMobile: false,
  searchFailed: false,
  previousSearchTerm: '',
  showNextButton: false,
  locale: '',
}

const mapStateToProps = (state) => {
  return {
    isMobile: isMobileBrowser(),
    searchFailed: getSearchFailed(state),
    previousSearchTerm: getPreviousSearchTerm(state),
    showNextButton: getShowNextButton(state),
    locale: getLocale(state),
    shouldShowContextualResults: shouldShowContextualResults(state),
  }
}

const connectedComponent = connect(mapStateToProps)(NoResults)

export { connectedComponent as default, NoResults as Component }
