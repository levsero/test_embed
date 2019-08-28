import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import WidgetContainer from 'src/components/WidgetContainer'
import SearchHeader from 'src/embeds/helpCenter/components/SearchHeader'
import WidgetMain from 'src/components/WidgetMain'
import Footer from 'src/embeds/helpCenter/components/Footer'
import Results from 'src/embeds/helpCenter/components/Results'
import {
  getResultsLocale,
  getSearchFailed,
  getPreviousSearchTerm,
  getHasSearched,
  getHasContextuallySearched,
  getArticles,
  getArticleViewActive,
  getIsContextualSearchComplete,
  getContextualHelpRequestNeeded
} from 'embeds/helpCenter/selectors'
import { handleArticleClick } from 'embeds/helpCenter/actions'
import { updateBackButtonVisibility } from 'src/redux/modules/base'
import {
  getHideZendeskLogo,
  getSettingsHelpCenterTitle,
  getShowNextButton
} from 'src/redux/modules/selectors'
import { isMobileBrowser } from 'utility/devices'

const SearchPage = ({
  handleArticleClick,
  updateBackButtonVisibility,
  articles,
  title,
  searchFailed,
  resultsLocale,
  previousSearchTerm,
  hasContextualSearched,
  isContextualSearchComplete,
  showNextButton,
  hideZendeskLogo,
  isMobile,
  contextualHelpRequestNeeded,
  hasSearched,
  onClick
}) => {
  const onArticleClick = (articleIndex, e) => {
    e.preventDefault()
    handleArticleClick(articles[articleIndex])
    updateBackButtonVisibility()
  }

  return (
    <WidgetContainer>
      <SearchHeader isMobile={isMobile}>{title}</SearchHeader>
      <WidgetMain>
        <Results
          articles={articles}
          searchFailed={searchFailed}
          locale={resultsLocale}
          previousSearchTerm={previousSearchTerm}
          handleArticleClick={onArticleClick}
          hasContextualSearched={hasContextualSearched}
          isContextualSearchComplete={isContextualSearchComplete}
          showContactButton={showNextButton}
          hideZendeskLogo={hideZendeskLogo}
          isMobile={isMobile}
          contextualHelpRequestNeeded={contextualHelpRequestNeeded}
          hasSearched={hasSearched}
        />
      </WidgetMain>
      <Footer
        isMobile={isMobile}
        hideZendeskLogo={hideZendeskLogo}
        onClick={onClick}
        showNextButton={showNextButton}
      />
    </WidgetContainer>
  )
}

SearchPage.propTypes = {
  onClick: PropTypes.func,
  hasSearched: PropTypes.bool,
  hideZendeskLogo: PropTypes.bool,
  showNextButton: PropTypes.bool,
  title: PropTypes.string.isRequired,
  contextualHelpRequestNeeded: PropTypes.bool,
  isMobile: PropTypes.bool,
  isContextualSearchComplete: PropTypes.bool,
  hasContextualSearched: PropTypes.bool,
  handleArticleClick: PropTypes.func,
  previousSearchTerm: PropTypes.string,
  resultsLocale: PropTypes.string,
  searchFailed: PropTypes.bool,
  articles: PropTypes.array,
  updateBackButtonVisibility: PropTypes.func
}

const mapStateToProps = state => ({
  title: getSettingsHelpCenterTitle(state),
  previousSearchTerm: getPreviousSearchTerm(state),
  showNextButton: getShowNextButton(state),
  resultsLocale: getResultsLocale(state),
  searchFailed: getSearchFailed(state),
  isMobile: isMobileBrowser(),
  hideZendeskLogo: getHideZendeskLogo(state),
  hasContextualSearched: getHasContextuallySearched(state),
  isContextualSearchComplete: getIsContextualSearchComplete(state),
  articleViewActive: getArticleViewActive(state),
  hasSearched: getHasSearched(state),
  contextualHelpRequestNeeded: getContextualHelpRequestNeeded(state),
  articles: getArticles(state)
})

const actionCreators = {
  handleArticleClick,
  updateBackButtonVisibility
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators
)(SearchPage)

export { connectedComponent as default, SearchPage as Component }
