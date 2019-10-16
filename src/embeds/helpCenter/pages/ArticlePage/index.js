import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Widget, Main, Header } from 'src/components/Widget'
import HelpCenterFooter from 'src/embeds/helpCenter/components/Footer'
import { i18n } from 'service/i18n'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { getRestrictedImages, getResultsLocale, getArticles } from 'src/embeds/helpCenter/selectors'
import { getSettingsHelpCenterOriginalArticleButton } from 'src/redux/modules/settings/settings-selectors'
import {
  handleOriginalArticleClicked,
  performImageSearch,
  addRestrictedImage,
  closeCurrentArticle,
  handleArticleView
} from 'src/embeds/helpCenter/actions'
import {
  getSettingsHelpCenterTitle,
  getHelpCenterButtonLabel,
  getHideZendeskLogo,
  getChatConnectionConnecting,
  getShowNextButton
} from 'src/redux/modules/selectors'
import HelpCenterArticle from 'src/components/HelpCenterArticle'
import { isMobileBrowser } from 'utility/devices'

const ArticlePage = ({
  articles,
  addRestrictedImage,
  handleOriginalArticleClicked,
  hideZendeskLogo,
  isMobile,
  onClick,
  originalArticleButton,
  performImageSearch,
  restrictedImages,
  resultsLocale,
  title,
  showNextButton,
  match,
  handleArticleView,
  closeCurrentArticle
}) => {
  const { params } = match
  const article = _.find(articles, ['id', parseInt(params.id)])

  useEffect(() => {
    handleArticleView(article)

    return () => {
      closeCurrentArticle()
    }
  }, [article, closeCurrentArticle, handleArticleView])

  return (
    <Widget>
      <Header title={title} useReactRouter={true} />
      <Main>
        <HelpCenterArticle
          activeArticle={article}
          locale={resultsLocale}
          originalArticleButton={originalArticleButton}
          handleOriginalArticleClick={handleOriginalArticleClicked}
          storedImages={restrictedImages}
          imagesSender={performImageSearch}
          updateStoredImages={addRestrictedImage}
          isMobile={isMobile}
        />
      </Main>
      <HelpCenterFooter
        isMobile={isMobile}
        hideZendeskLogo={hideZendeskLogo}
        onClick={onClick}
        showNextButton={showNextButton}
      />
    </Widget>
  )
}

ArticlePage.propTypes = {
  handleArticleView: PropTypes.func.isRequired,
  handleOriginalArticleClicked: PropTypes.func.isRequired,
  closeCurrentArticle: PropTypes.func.isRequired,
  originalArticleButton: PropTypes.bool,
  performImageSearch: PropTypes.func.isRequired,
  restrictedImages: PropTypes.object.isRequired,
  addRestrictedImage: PropTypes.func,
  resultsLocale: PropTypes.string,
  title: PropTypes.string,
  isMobile: PropTypes.bool,
  hideZendeskLogo: PropTypes.bool,
  onClick: PropTypes.func,
  showNextButton: PropTypes.bool,
  match: PropTypes.object,
  articles: PropTypes.array
}

ArticlePage.defaultProps = {
  onClick: () => {}
}

const mapStateToProps = state => {
  const articleTitleKey = 'help'
  const titleKey = `embeddable_framework.helpCenter.form.title.${articleTitleKey}`

  return {
    locale: getLocale(state),
    articles: getArticles(state),
    showOriginalArticleButton: getSettingsHelpCenterOriginalArticleButton(state),
    resultsLocale: getResultsLocale(state),
    restrictedImages: getRestrictedImages(state),
    title: getSettingsHelpCenterTitle(state, titleKey),
    buttonLabel: getHelpCenterButtonLabel(state),
    hideZendeskLogo: getHideZendeskLogo(state),
    loading: getChatConnectionConnecting(state),
    isMobile: isMobileBrowser(),
    isRTL: i18n.isRTL(),
    showNextButton: getShowNextButton(state)
  }
}

const actionCreators = {
  handleOriginalArticleClicked,
  performImageSearch,
  addRestrictedImage,
  closeCurrentArticle,
  handleArticleView
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators
)(ArticlePage)

export { connectedComponent as default, ArticlePage as Component }
