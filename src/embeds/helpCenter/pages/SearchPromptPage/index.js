import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

import { Widget, Header, Main, Footer } from 'src/components/Widget'
import SearchForm from 'src/embeds/helpCenter/components/SearchForm'
import { getSettingsHelpCenterTitle } from 'src/redux/modules/selectors'
import { performSearch } from 'embeds/helpCenter/actions'
import { getHasSearched } from '../../selectors'
import routes from 'src/embeds/helpCenter/routes'

const SearchPromptPage = ({ title, hasSearched }) => {
  const inputRef = useRef(null)
  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.focus()
  }, [])

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
  hasSearched: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  title: getSettingsHelpCenterTitle(state),
  hasSearched: getHasSearched(state)
})

const mapDispatchToProps = {
  performSearch
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPromptPage)

export { connectedComponent as default, SearchPromptPage as Component }
