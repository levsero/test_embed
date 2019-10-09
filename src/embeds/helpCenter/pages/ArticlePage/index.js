import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Widget, Main, Header } from 'src/components/Widget'
import HelpCenterFooter from 'src/embeds/helpCenter/components/Footer'
import { i18n } from 'service/i18n'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import {
  getActiveArticle,
  getRestrictedImages,
  getResultsLocale
} from 'src/embeds/helpCenter/selectors'
import { getSettingsHelpCenterOriginalArticleButton } from 'src/redux/modules/settings/settings-selectors'
import {
  handleOriginalArticleClicked,
  performImageSearch,
  addRestrictedImage
} from 'src/embeds/helpCenter/actions'
import {
  getSettingsHelpCenterTitle,
  getHelpCenterButtonLabel,
  getChatConnectionConnecting,
  getShowNextButton
} from 'src/redux/modules/selectors'
import HelpCenterArticle from 'src/components/HelpCenterArticle'
import { isMobileBrowser } from 'utility/devices'

const ArticlePage = ({
  activeArticle,
  addRestrictedImage,
  handleOriginalArticleClicked,
  isMobile,
  onClick,
  originalArticleButton,
  performImageSearch,
  restrictedImages,
  resultsLocale,
  title,
  showNextButton
}) => {
  return (
    <Widget>
      <Header title={title} />
      <Main>
        <HelpCenterArticle
          activeArticle={activeArticle}
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
  activeArticle: PropTypes.object,
  originalArticleButton: PropTypes.bool,
  performImageSearch: PropTypes.func.isRequired,
  handleOriginalArticleClicked: PropTypes.func.isRequired,
  restrictedImages: PropTypes.objectOf(PropTypes.string).isRequired,
  addRestrictedImage: PropTypes.func,
  resultsLocale: PropTypes.string,
  title: PropTypes.string,
  isMobile: PropTypes.bool,
  onClick: PropTypes.func,
  showNextButton: PropTypes.bool
}

ArticlePage.defaultProps = {
  onClick: () => {}
}

const mapStateToProps = state => {
  const articleTitleKey = 'help'
  const titleKey = `embeddable_framework.helpCenter.form.title.${articleTitleKey}`

  return {
    locale: getLocale(state),
    activeArticle: getActiveArticle(state),
    originalArticleButton: getSettingsHelpCenterOriginalArticleButton(state),
    resultsLocale: getResultsLocale(state),
    restrictedImages: getRestrictedImages(state),
    title: getSettingsHelpCenterTitle(state, titleKey),
    buttonLabel: getHelpCenterButtonLabel(state),
    loading: getChatConnectionConnecting(state),
    isMobile: isMobileBrowser(),
    isRTL: i18n.isRTL(),
    showNextButton: getShowNextButton(state)
  }
}

const actionCreators = {
  handleOriginalArticleClicked,
  performImageSearch,
  addRestrictedImage
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators
)(ArticlePage)

export { connectedComponent as default, ArticlePage as Component }
