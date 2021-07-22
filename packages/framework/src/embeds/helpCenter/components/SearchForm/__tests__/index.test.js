import { fireEvent, wait } from '@testing-library/react'
import { getSearchLoading } from 'embeds/helpCenter/selectors'
import { http } from 'service/transport'
import { render } from 'utility/testHelpers'
import SearchForm from '../index'

http.get = jest.fn(() => {
  return new Promise((resolve) => {
    resolve()
  })
})

const renderInitialSearchForm = () => {
  const utils = render(<SearchForm />)

  const inputNode = utils.getByPlaceholderText('How can we help?')
  const formNode = utils.container.querySelector('form')

  return { ...utils, inputNode, formNode }
}

describe('when a search term is provided', () => {
  it('searches', async () => {
    const { inputNode, formNode, store } = renderInitialSearchForm()

    expect(getSearchLoading(store.getState())).toEqual(false)
    fireEvent.change(inputNode, { target: { value: 'help me!' } })
    fireEvent.submit(formNode)

    expect(getSearchLoading(store.getState())).toEqual(true)
  })

  it('renders the search value', async () => {
    const { inputNode, formNode, queryByPlaceholderText } = renderInitialSearchForm()

    fireEvent.change(inputNode, { target: { value: 'help me!' } })
    fireEvent.submit(formNode)

    await wait(() => {
      expect(queryByPlaceholderText('How can we help?').value).toEqual('help me!')
    })
  })
})

describe('when no search term is provided', () => {
  it('does not search', () => {
    const { inputNode, formNode, store } = renderInitialSearchForm()

    expect(getSearchLoading(store.getState())).toEqual(false)
    fireEvent.change(inputNode, { target: { value: '' } })
    fireEvent.submit(formNode)
    expect(getSearchLoading(store.getState())).toEqual(false)
  })

  it('renders the search placeholder text', () => {
    const { queryByPlaceholderText } = renderInitialSearchForm()

    expect(queryByPlaceholderText('How can we help?')).toBeInTheDocument()
  })
})
