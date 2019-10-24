import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
import { render } from 'utility/testHelpers'
import { getSearchLoading } from 'embeds/helpCenter/selectors'
import SearchForm, { Component } from '../index'

jest.mock('service/transport')

const renderInitialSearchForm = () => {
  const utils = render(<SearchForm />)

  const inputNode = utils.getByPlaceholderText('How can we help?')
  const formNode = utils.container.querySelector('form')

  return { ...utils, inputNode, formNode }
}

it('searches when text provided', async () => {
  const { inputNode, formNode, store } = renderInitialSearchForm()

  expect(getSearchLoading(store.getState())).toEqual(false)
  fireEvent.change(inputNode, { target: { value: 'help me!' } })
  fireEvent.submit(formNode)

  await wait(() => {
    expect(getSearchLoading(store.getState())).toEqual(true)
  })
})

it('does not search when no text provided', () => {
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

it('renders the initial search value', () => {
  const { queryByPlaceholderText } = render(
    <Component
      value="Help"
      performSearch={jest.fn()}
      searchPlaceholder="HOw?"
      handleSearchFieldChange={jest.fn()}
    />
  )

  expect(queryByPlaceholderText('HOw?').value).toEqual('Help')
})
