import { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SearchField from 'embeds/helpCenter/components/SearchField'
import { performSearch, handleSearchFieldChange } from 'embeds/helpCenter/actions'
import { TEST_IDS } from 'src/constants/shared'
import { Form } from './styles'

const useSearchForm = (callback, handleOnChangeValue) => {
  const [searchValue, setSearchValue] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchValue) {
      callback(searchValue)
    }
  }

  return {
    handleOnChange: (text) => {
      setSearchValue(text)
      handleOnChangeValue(text)
    },
    handleSubmit,
  }
}

const SearchForm = ({ performSearch, handleSearchFieldChange, inputRef }) => {
  const { handleOnChange, handleSubmit } = useSearchForm(performSearch, handleSearchFieldChange)

  return (
    <Form noValidate={true} onSubmit={handleSubmit}>
      <SearchField
        inputRef={inputRef}
        onChange={handleOnChange}
        data-testid={TEST_IDS.SEARCH_FIELD}
      />
    </Form>
  )
}

SearchForm.propTypes = {
  performSearch: PropTypes.func.isRequired,
  handleSearchFieldChange: PropTypes.func,
  inputRef: PropTypes.object,
}

const mapDispatchToProps = {
  performSearch,
  handleSearchFieldChange,
}

const connectedComponent = connect(null, mapDispatchToProps)(SearchForm)

export { connectedComponent as default, SearchForm as Component }
