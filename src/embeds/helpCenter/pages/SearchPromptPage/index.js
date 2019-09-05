import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import WidgetContainer from 'src/components/WidgetContainer'
import WidgetHeader from 'src/components/WidgetHeader'
import WidgetMain from 'src/components/WidgetMain'
import WidgetFooter from 'src/components/WidgetFooter'
import ZendeskLogo from 'src/components/ZendeskLogo'
import SearchForm from 'src/embeds/helpCenter/components/SearchForm'
import { locals as styles } from './styles.scss'
import { getHideZendeskLogo, getSettingsHelpCenterTitle } from 'src/redux/modules/selectors'
import { isMobileBrowser } from 'utility/devices'
import { performSearch } from 'embeds/helpCenter/actions'
import { i18n } from 'service/i18n'

const SearchPromptPage = ({ title, hideZendeskLogo, isMobile, header }) => {
  const searchFormRef = useRef(null)
  useEffect(() => {
    searchFormRef.current.focus()
  }, [])
  return (
    <WidgetContainer>
      <WidgetHeader>{title}</WidgetHeader>
      <WidgetMain>
        {isMobile && <h1 className={styles.title}>{header}</h1>}
        <SearchForm ref={searchFormRef} />
      </WidgetMain>
      <WidgetFooter>
        {!hideZendeskLogo && (
          <div className={styles.footer}>
            <ZendeskLogo />
          </div>
        )}
      </WidgetFooter>
    </WidgetContainer>
  )
}

SearchPromptPage.propTypes = {
  header: PropTypes.string,
  isMobile: PropTypes.bool,
  title: PropTypes.string.isRequired,
  hideZendeskLogo: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  isMobile: isMobileBrowser(),
  title: getSettingsHelpCenterTitle(state),
  header: i18n.t('embeddable_framework.helpCenter.label.searchHelpCenter'),
  hideZendeskLogo: getHideZendeskLogo(state)
})

const mapDispatchToProps = {
  performSearch
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPromptPage)

export { connectedComponent as default, SearchPromptPage as Component }
