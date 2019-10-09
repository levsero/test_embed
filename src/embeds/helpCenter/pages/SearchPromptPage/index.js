import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Widget, Header, Main, Footer } from 'src/components/Widget'
import SearchForm from 'src/embeds/helpCenter/components/SearchForm'
import { getSettingsHelpCenterTitle } from 'src/redux/modules/selectors'
import { performSearch } from 'embeds/helpCenter/actions'

const SearchPromptPage = ({ title }) => {
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
      <Footer />
    </Widget>
  )
}

SearchPromptPage.propTypes = {
  title: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  title: getSettingsHelpCenterTitle(state)
})

const mapDispatchToProps = {
  performSearch
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPromptPage)

export { connectedComponent as default, SearchPromptPage as Component }
