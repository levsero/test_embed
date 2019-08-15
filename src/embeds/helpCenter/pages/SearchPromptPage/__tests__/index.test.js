import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'
import SearchPromptPage from '../index'

const renderInitialSearchPage = () => {
  const makeSearchRequestSpy = jest.fn()
  const utils = render(
    <Provider store={createStore()}>
      <SearchPromptPage
        title="yolo"
        makeSearchRequest={makeSearchRequestSpy}
        isLoading={false}
        searchPlaceholder="yoloPlaceHolder"
      />
    </Provider>
  )

  const inputNode = utils.getByPlaceholderText('yoloPlaceHolder')
  const formNode = utils.container.querySelector('form')

  return { ...utils, inputNode, formNode, makeSearchRequestSpy }
}

it('searches when text provided', () => {
  const { inputNode, formNode, makeSearchRequestSpy } = renderInitialSearchPage()

  fireEvent.change(inputNode, { target: { value: 'help me!' } })
  fireEvent.submit(formNode)

  expect(makeSearchRequestSpy).toHaveBeenCalled()
})

it('does not search when no text provided', () => {
  const { inputNode, formNode, makeSearchRequestSpy } = renderInitialSearchPage()

  fireEvent.change(inputNode, { target: { value: '' } })
  fireEvent.submit(formNode)

  expect(makeSearchRequestSpy).not.toHaveBeenCalled()
})
