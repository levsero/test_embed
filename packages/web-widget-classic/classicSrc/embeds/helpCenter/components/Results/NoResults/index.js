import ContextualNoResultsMessage from 'classicSrc/embeds/helpCenter/components/ContextualNoResultsMessage'
import NoResultsMessage from 'classicSrc/embeds/helpCenter/components/NoResultsMessage'
import {
  getSearchFailed,
  getPreviousSearchTerm,
  shouldShowContextualResults,
} from 'classicSrc/embeds/helpCenter/selectors'
import { getLocale } from 'classicSrc/redux/modules/base/base-selectors'
import { getShowNextButton } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isMobileBrowser } from '@zendesk/widget-shared-services'

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
