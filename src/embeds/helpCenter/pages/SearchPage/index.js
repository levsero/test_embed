import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import WidgetContainer from 'src/components/WidgetContainer'
import SearchHeader from 'src/embeds/helpCenter/components/SearchHeader'
import WidgetMain from 'src/components/WidgetMain'
import Footer from 'src/embeds/helpCenter/components/Footer'
import Results from 'src/embeds/helpCenter/components/Results'
import LoadingBarContent from 'src/component/loading/LoadingBarContent'

import {
  getHideZendeskLogo,
  getSettingsHelpCenterTitle,
  getShowNextButton
} from 'src/redux/modules/selectors'
import { getIsContextualSearchPending, getArticles } from 'embeds/helpCenter/selectors'
import { isMobileBrowser } from 'utility/devices'

const SearchPage = ({
  title,
  showNextButton,
  hideZendeskLogo,
  isMobile,
  onClick,
  isContextualSearchPending,
  articles
}) => {
  const searchHeaderRef = useRef(null),
    resultsRef = React.useRef(null)
  const content = isContextualSearchPending ? <LoadingBarContent /> : <Results ref={resultsRef} />
  useEffect(() => {
    if (!articles.length) {
      searchHeaderRef.current.focus()
    }
  }, [articles])

  return (
    <WidgetContainer>
      <SearchHeader ref={searchHeaderRef} isMobile={isMobile}>
        {title}
      </SearchHeader>
      <WidgetMain>{content}</WidgetMain>
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
