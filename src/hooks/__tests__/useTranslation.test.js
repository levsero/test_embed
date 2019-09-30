import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'
import useTranslation from './../useTranslation'

describe('useTranslation', () => {
  const SomeComponent = () => {
    const result = useTranslation('embeddable_framework.chat.options.emailTranscript')

    return <div>{result}</div>
  }

  it('returns the translation for the provided key', () => {
    const { queryByText } = render(
      <Provider store={createStore()}>
        <SomeComponent />
      </Provider>
    )

    expect(queryByText('Email transcript')).toBeInTheDocument()
  })
})
