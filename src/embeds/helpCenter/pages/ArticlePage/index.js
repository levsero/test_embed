import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import WidgetMain from 'src/components/WidgetMain'
import WidgetFooter from 'src/components/WidgetFooter'
import WidgetContainer from 'src/components/WidgetContainer'
import WidgetHeader from 'src/components/WidgetHeader'
import { locals as styles } from 'src/embeds/helpCenter/pages/ArticlePage/index.scss'
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
  getHideZendeskLogo,
  getChatConnectionConnecting,
  getShowNextButton
} from 'src/redux/modules/selectors'
import HelpCenterArticle from 'src/components/HelpCenterArticle'
import ZendeskLogo from 'src/components/ZendeskLogo'
import HelpCenterChannelButton from 'src/embeds/helpCenter/components/HelpCenterChannelButton'
import { isMobileBrowser } from 'utility/devices'

const ArticlePage = ({
  activeArticle,
  addRestrictedImage,
  buttonLabel,
  handleOriginalArticleClicked,
  hideZendeskLogo,
  isMobile,
  loading,
  onClick,
  originalArticleButton,
  performImageSearch,
  restrictedImages,
  resultsLocale,
  title,
  isRTL,
  showNextButton
}) => {
  return (
    <WidgetContainer>
      <WidgetHeader>{title}</WidgetHeader>
      <WidgetMain>
        <HelpCenterArticle
          activeArticle={activeArticle}
          locale={resultsLocale}
          originalArticleButton={originalArticleButton}
          handleOriginalArticleClick={handleOriginalArticleClicked}
          storedImages={restrictedImages}
          imagesSender={performImageSearch}
          updateStoredImages={addRestrictedImage}
          fullscreen={false}
          isMobile={isMobile}
        />
      </WidgetMain>
      <WidgetFooter scrollShadowVisible={!hideZendeskLogo}>
        <div className={!hideZendeskLogo && !isMobile ? styles.footerContentMultiple : ''}>
          {!hideZendeskLogo && !isMobile && <ZendeskLogo />}
          {showNextButton && (
            <HelpCenterChannelButton
              buttonLabel={buttonLabel}
              isRTL={isRTL}
              loading={loading}
              onClick={onClick}
              isMobile={isMobile}
            />
          )}
        </div>
      </WidgetFooter>
    </WidgetContainer>
  )
}

ArticlePage.propTypes = {
  buttonLabel: PropTypes.string,
  activeArticle: PropTypes.object,
  originalArticleButton: PropTypes.bool,
  performImageSearch: PropTypes.func.isRequired,
  handleOriginalArticleClicked: PropTypes.func.isRequired,
  restrictedImages: PropTypes.object.isRequired,
  addRestrictedImage: PropTypes.func,
  resultsLocale: PropTypes.string,
  title: PropTypes.string,
  isMobile: PropTypes.bool,
  hideZendeskLogo: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  isRTL: PropTypes.bool,
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
  addRestrictedImage
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators
)(ArticlePage)

export { connectedComponent as default, ArticlePage as Component }
