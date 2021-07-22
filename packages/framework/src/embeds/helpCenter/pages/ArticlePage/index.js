import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTheme } from 'styled-components'
import HelpCenterArticle from 'src/components/HelpCenterArticle'
import { Widget, Main, Header } from 'src/components/Widget'
import {
  handleOriginalArticleClicked,
  performImageSearch,
  addRestrictedImage,
  closeCurrentArticle,
  handleArticleView,
} from 'src/embeds/helpCenter/actions'
import HelpCenterFooter from 'src/embeds/helpCenter/components/Footer'
import { getRestrictedImages, getResultsLocale, getArticles } from 'src/embeds/helpCenter/selectors'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import {
  getSettingsHelpCenterTitle,
  getHelpCenterButtonLabel,
  getChatConnectionConnecting,
  getShowNextButton,
} from 'src/redux/modules/selectors'
import { getSettingsHelpCenterOriginalArticleButton } from 'src/redux/modules/settings/settings-selectors'

const ArticlePage = ({
  addRestrictedImage,
  handleOriginalArticleClicked,
  theme: { isMobile },
  onClick,
  originalArticleButton,
  performImageSearch,
  restrictedImages,
  resultsLocale,
  title,
  showNextButton,
  handleArticleView,
  closeCurrentArticle,
  article,
}) => {
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
      <HelpCenterFooter onClick={onClick} showNextButton={showNextButton} />
    </Widget>
  )
}

ArticlePage.propTypes = {
  handleArticleView: PropTypes.func.isRequired,
  handleOriginalArticleClicked: PropTypes.func.isRequired,
  closeCurrentArticle: PropTypes.func.isRequired,
  originalArticleButton: PropTypes.bool,
  performImageSearch: PropTypes.func.isRequired,
  restrictedImages: PropTypes.objectOf(PropTypes.string).isRequired,
  addRestrictedImage: PropTypes.func,
  resultsLocale: PropTypes.string,
  title: PropTypes.string,
  theme: PropTypes.shape({ isMobile: PropTypes.bool }),
  onClick: PropTypes.func,
  showNextButton: PropTypes.bool,
  article: PropTypes.object,
}

ArticlePage.defaultProps = {
  onClick: () => {},
}

const mapStateToProps = (state, ownProps) => {
  const articleTitleKey = 'help'
  const titleKey = `embeddable_framework.helpCenter.form.title.${articleTitleKey}`
  const { params } = ownProps.match
  const id = parseInt(params.id)

  return {
    locale: getLocale(state),
    article: getArticles(state)[id],
    originalArticleButton: getSettingsHelpCenterOriginalArticleButton(state),
    resultsLocale: getResultsLocale(state),
    restrictedImages: getRestrictedImages(state),
    title: getSettingsHelpCenterTitle(state, titleKey),
    buttonLabel: getHelpCenterButtonLabel(state),
    loading: getChatConnectionConnecting(state),
    showNextButton: getShowNextButton(state),
  }
}

const actionCreators = {
  handleOriginalArticleClicked,
  performImageSearch,
  addRestrictedImage,
  closeCurrentArticle,
  handleArticleView,
}

const themedComponent = withTheme(ArticlePage)

const connectedComponent = connect(mapStateToProps, actionCreators)(themedComponent)

export { connectedComponent as default, themedComponent as Component }
