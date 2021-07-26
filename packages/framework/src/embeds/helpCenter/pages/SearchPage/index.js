import PropTypes from 'prop-types'
import { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import LoadingBarContent from 'src/components/LoadingBarContent'
import { Widget, Main } from 'src/components/Widget'
import HelpCenterFooter from 'src/embeds/helpCenter/components/Footer'
import NotificationPopup from 'src/embeds/helpCenter/components/NotificationPopup'
import Results from 'src/embeds/helpCenter/components/Results'
import SearchHeader from 'src/embeds/helpCenter/components/SearchHeader'
import { getSearchLoading, getSearchedArticles } from 'src/embeds/helpCenter/selectors'
import {
  getHideZendeskLogo,
  getSettingsHelpCenterTitle,
  getShowNextButton,
} from 'src/redux/modules/selectors'
import { isMobileBrowser } from 'src/util/devices'

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
