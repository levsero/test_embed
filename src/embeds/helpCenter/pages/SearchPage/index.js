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
import { getSearchLoading, getSearchedArticles } from 'embeds/helpCenter/selectors'
import { isMobileBrowser } from 'utility/devices'
import LoadingBarContent from 'src/components/LoadingBarContent'
import NotificationPopup from 'src/embeds/helpCenter/components/NotificationPopup'

const SearchPage = ({ title, showNextButton, isMobile, isSearchLoading, articles }) => {
  const searchHeaderRef = useRef(null)
  const content = isSearchLoading ? <LoadingBarContent /> : <Results />
  useEffect(() => {
    if (!articles.length) {
      searchHeaderRef.current.focus()
    }
  }, [articles])

  return (
    <Widget>
      <SearchHeader ref={searchHeaderRef} isMobile={isMobile} title={title} />
      <Main>{content}</Main>
      <HelpCenterFooter showNextButton={showNextButton} />
      {!isMobile && <NotificationPopup />}
    </Widget>
  )
}

SearchPage.propTypes = {
  showNextButton: PropTypes.bool,
  title: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  isSearchLoading: PropTypes.bool,
  articles: PropTypes.array
}

const mapStateToProps = state => ({
  title: getSettingsHelpCenterTitle(state),
  showNextButton: getShowNextButton(state),
  isMobile: isMobileBrowser(),
  hideZendeskLogo: getHideZendeskLogo(state),
  isSearchLoading: getSearchLoading(state),
  articles: getSearchedArticles(state)
})

const connectedComponent = connect(mapStateToProps)(SearchPage)

export { connectedComponent as default, SearchPage as Component }
