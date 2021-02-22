import { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

import { Widget, Header, Main, Footer } from 'src/components/Widget'
import SearchForm from 'src/embeds/helpCenter/components/SearchForm'
import { getHideZendeskLogo, getSettingsHelpCenterTitle } from 'src/redux/modules/selectors'
import { performSearch } from 'embeds/helpCenter/actions'
import { getHasSearched } from '../../selectors'
import routes from 'src/embeds/helpCenter/routes'
import { useFrameStyle } from 'embeds/webWidget/components/BaseFrame/FrameStyleContext'
import {
  WIDGET_MARGIN,
  DEFAULT_WIDGET_HEIGHT_NO_SEARCH,
  DEFAULT_WIDGET_HEIGHT_NO_SEARCH_NO_ZENDESK_LOGO,
} from 'constants/shared'
import { isMobileBrowser } from 'utility/devices'

const frameStyle = {
  height: DEFAULT_WIDGET_HEIGHT_NO_SEARCH + 2 * WIDGET_MARGIN,
}

const frameStyleWithoutLogo = {
  height: DEFAULT_WIDGET_HEIGHT_NO_SEARCH_NO_ZENDESK_LOGO + 2 * WIDGET_MARGIN,
}

const mobileFrameStyle = {}

const SearchPromptPage = ({ title, hasSearched, isLogoHidden }) => {
  const inputRef = useRef(null)
  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.focus()
  }, [])

  const desktopFrameStyle = isLogoHidden ? frameStyleWithoutLogo : frameStyle
  useFrameStyle(isMobileBrowser() ? mobileFrameStyle : desktopFrameStyle)

  if (hasSearched) return <Redirect to={routes.search()} />

  return (
    <Widget>
      <Header title={title} />
      <Main>
        <SearchForm inputRef={inputRef} />
      </Main>
      <Footer shadow={false} />
    </Widget>
  )
}

SearchPromptPage.propTypes = {
  title: PropTypes.string.isRequired,
  hasSearched: PropTypes.bool.isRequired,
  isLogoHidden: PropTypes.bool,
}

const mapStateToProps = (state) => ({
  title: getSettingsHelpCenterTitle(state),
  hasSearched: getHasSearched(state),
  isLogoHidden: getHideZendeskLogo(state),
})

const mapDispatchToProps = {
  performSearch,
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(SearchPromptPage)

export { connectedComponent as default, SearchPromptPage as Component }
