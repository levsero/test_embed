import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Widget, Main } from 'src/components/Widget'
import SearchHeader from 'src/embeds/helpCenter/components/SearchHeader'
import HelpCenterFooter from 'src/embeds/helpCenter/components/Footer'
import Results from 'src/embeds/helpCenter/components/Results'

import {
  getHideZendeskLogo,
  getSettingsHelpCenterTitle,
  getShowNextButton
} from 'src/redux/modules/selectors'
import { getIsContextualSearchPending, getArticles } from 'embeds/helpCenter/selectors'
import { isMobileBrowser } from 'utility/devices'
import LoadingBarContent from 'src/components/LoadingBarContent'

const SearchPage = ({
  title,
  showNextButton,
  hideZendeskLogo,
  isMobile,
  isContextualSearchPending,
  articles
}) => {
  const searchHeaderRef = useRef(null)
  const content = isContextualSearchPending ? <LoadingBarContent /> : <Results />
  useEffect(() => {
    if (!articles.length) {
      searchHeaderRef.current.focus()
    }
  }, [articles])

  return (
    <Widget>
      <SearchHeader ref={searchHeaderRef} isMobile={isMobile}>
        {title}
      </SearchHeader>
      <Main>{content}</Main>
      <HelpCenterFooter
        isMobile={isMobile}
        hideZendeskLogo={hideZendeskLogo}
        showNextButton={showNextButton}
      />
    </Widget>
  )
}

SearchPage.propTypes = {
  hideZendeskLogo: PropTypes.bool,
  showNextButton: PropTypes.bool,
  title: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  isContextualSearchPending: PropTypes.bool,
  articles: PropTypes.array
}

const mapStateToProps = state => ({
  title: getSettingsHelpCenterTitle(state),
  showNextButton: getShowNextButton(state),
  isMobile: isMobileBrowser(),
  hideZendeskLogo: getHideZendeskLogo(state),
  isContextualSearchPending: getIsContextualSearchPending(state),
  articles: getArticles(state)
})

const connectedComponent = connect(mapStateToProps)(SearchPage)

export { connectedComponent as default, SearchPage as Component }
