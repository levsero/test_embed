import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Widget, Header, Main, Footer } from 'src/components/Widget'
import ZendeskLogo from 'src/components/ZendeskLogo'
import SearchForm from 'src/embeds/helpCenter/components/SearchForm'
import { locals as styles } from './styles.scss'
import { getHideZendeskLogo, getSettingsHelpCenterTitle } from 'src/redux/modules/selectors'
import { performSearch } from 'embeds/helpCenter/actions'

const SearchPromptPage = ({ title, hideZendeskLogo }) => {
  const searchFormRef = useRef(null)
  useEffect(() => {
    searchFormRef.current.focus()
  }, [])
  return (
    <Widget>
      <Header title={title} />
      <Main>
        <SearchForm ref={searchFormRef} />
      </Main>
      <Footer>
        {!hideZendeskLogo && (
          <div className={styles.footer}>
            <ZendeskLogo />
          </div>
        )}
      </Footer>
    </Widget>
  )
}

SearchPromptPage.propTypes = {
  title: PropTypes.string.isRequired,
  hideZendeskLogo: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  title: getSettingsHelpCenterTitle(state),
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
