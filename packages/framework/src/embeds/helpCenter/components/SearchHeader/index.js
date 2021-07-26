import PropTypes from 'prop-types'
import { Header, HeaderRow } from 'src/components/Widget'
import { TEST_IDS } from 'src/constants/shared'
import SearchForm from 'src/embeds/helpCenter/components/SearchForm'
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
