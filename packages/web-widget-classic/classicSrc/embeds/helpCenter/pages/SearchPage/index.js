import LoadingBarContent from 'classicSrc/components/LoadingBarContent'
import { Widget, Main } from 'classicSrc/components/Widget'
import HelpCenterFooter from 'classicSrc/embeds/helpCenter/components/Footer'
import NotificationPopup from 'classicSrc/embeds/helpCenter/components/NotificationPopup'
import Results from 'classicSrc/embeds/helpCenter/components/Results'
import SearchHeader from 'classicSrc/embeds/helpCenter/components/SearchHeader'
import { getSearchLoading, getSearchedArticles } from 'classicSrc/embeds/helpCenter/selectors'
import {
  getHideZendeskLogo,
  getSettingsHelpCenterTitle,
  getShowNextButton,
} from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { isMobileBrowser } from '@zendesk/widget-shared-services'

const SearchPage = ({ title, showNextButton, isMobile, isSearchLoading, articles }) => {
  const inputRef = useRef(null)
  const content = isSearchLoading ? <LoadingBarContent /> : <Results />
  useEffect(() => {
    if (!articles.length) {
      inputRef.current.focus()
    }
  }, [articles])

  return (
    <Widget>
      <SearchHeader isMobile={isMobile} title={title} inputRef={inputRef} />
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
  articles: PropTypes.array,
}

const mapStateToProps = (state) => ({
  title: getSettingsHelpCenterTitle(state),
  showNextButton: getShowNextButton(state),
  isMobile: isMobileBrowser(),
  hideZendeskLogo: getHideZendeskLogo(state),
  isSearchLoading: getSearchLoading(state),
  articles: getSearchedArticles(state),
})

const connectedComponent = connect(mapStateToProps)(SearchPage)

export { connectedComponent as default, SearchPage as Component }
