import { handleArticleView } from 'classicSrc/embeds/helpCenter/actions'
import Legend from 'classicSrc/embeds/helpCenter/components/Legend'
import List from 'classicSrc/embeds/helpCenter/components/List'
import {
  getSearchedArticles,
  getHasContextuallySearched,
  getPreviousActiveArticle,
} from 'classicSrc/embeds/helpCenter/selectors'
import { getLocale } from 'classicSrc/redux/modules/base/base-selectors'
import { getHideZendeskLogo, getShowNextButton } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { isMobileBrowser } from '@zendesk/widget-shared-services'

const HasResults = ({
  isMobile,
  articles,
  showNextButton,
  hideZendeskLogo,
  locale,
  hasContextuallySearched,
  previousArticle,
}) => {
  const listRef = useRef(null)

  useEffect(() => {
    if (articles) {
      listRef.current.focusOn(previousArticle || articles[0].id)
    }
  }, [articles, previousArticle])

  return (
    <div>
      <Legend hasContextuallySearched={hasContextuallySearched} locale={locale} />
      <List
        ref={listRef}
        isMobile={isMobile}
        articles={articles}
        showNextButton={showNextButton}
        hideZendeskLogo={hideZendeskLogo}
        locale={locale}
      />
    </div>
  )
}

HasResults.propTypes = {
  isMobile: PropTypes.bool,
  articles: PropTypes.array,
  showNextButton: PropTypes.bool,
  hideZendeskLogo: PropTypes.bool,
  locale: PropTypes.string,
  hasContextuallySearched: PropTypes.bool,
  previousArticle: PropTypes.number,
}

const mapStateToProps = (state) => {
  return {
    isMobile: isMobileBrowser(),
    articles: getSearchedArticles(state),
    showNextButton: getShowNextButton(state),
    hideZendeskLogo: getHideZendeskLogo(state),
    locale: getLocale(state),
    hasContextuallySearched: getHasContextuallySearched(state),
    previousArticle: getPreviousActiveArticle(state),
  }
}

const actionCreators = {
  handleArticleView,
}

const connectedComponent = connect(mapStateToProps, actionCreators)(HasResults)

export { connectedComponent as default, HasResults as Component }
