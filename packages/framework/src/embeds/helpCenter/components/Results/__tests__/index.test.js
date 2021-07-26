import * as selectors from 'src/embeds/helpCenter/selectors'
import { render } from 'src/util/testHelpers'
import Results from '../index'

const articles = [
  { id: 1, title: 'jane eyre' },
  { id: 2, title: 'pride and prejudice' },
]

const renderComponent = () => {
  return render(<Results />)
}

describe('when there are articles', () => {
  beforeEach(() => {
    jest.spyOn(selectors, 'getSearchedArticles').mockReturnValue(articles)
  })

  it('renders the HasResultsPage with a list of articles', () => {
    const { getByText } = renderComponent()

    expect(getByText('Top results')).toBeInTheDocument()
    expect(getByText(articles[0].title)).toBeInTheDocument()
    expect(getByText(articles[1].title)).toBeInTheDocument()
  })
})

describe('when there are no articles', () => {
  beforeEach(() => {
    jest.spyOn(selectors, 'getSearchedArticles').mockReturnValue([])
  })

  it('renders the NoResults page suggesting a different search', () => {
    const { getByText } = renderComponent()

    expect(getByText('Try searching for something else.')).toBeInTheDocument()
  })
})
