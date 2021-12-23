import { Header, HeaderRow } from 'classicSrc/components/Widget'
import { TEST_IDS } from 'classicSrc/constants/shared'
import SearchForm from 'classicSrc/embeds/helpCenter/components/SearchForm'
import PropTypes from 'prop-types'
import { Container } from './styles'

const SearchHeader = ({ title, inputRef }) => {
  return (
    <Header title={title}>
      <HeaderRow>
        <Container data-testid={TEST_IDS.HEADER_CONTAINER}>
          <SearchForm inputRef={inputRef} />
        </Container>
      </HeaderRow>
    </Header>
  )
}

SearchHeader.propTypes = {
  title: PropTypes.string.isRequired,
  inputRef: PropTypes.object,
}

export default SearchHeader
