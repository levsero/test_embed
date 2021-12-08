import { render } from '@testing-library/react'
import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import createStore from 'classicSrc/redux/createStore'
import { Provider } from 'react-redux'
import useGetTitle from '../useGetTitle'

describe('useGetTitle', () => {
  const SomeComponent = () => {
    const getTitle = useGetTitle()
    const result = getTitle('embeddable_framework.talk.form.title')

    return <div>{result}</div>
  }

  describe('returns the translation function which then uses the setting translation or fallback', () => {
    describe('when the setting translation exists', () => {
      it('returns the the settings translation', () => {
        jest.spyOn(i18n, 'getSettingTranslation').mockReturnValue('mocked title')

        const { getByText } = render(
          <Provider store={createStore()}>
            <SomeComponent />
          </Provider>
        )

        expect(getByText('mocked title')).toBeInTheDocument()
      })
    })

    describe('when the settings translation is missing', () => {
      it('returns the fallback translation', () => {
        const { getByText } = render(
          <Provider store={createStore()}>
            <SomeComponent />
          </Provider>
        )

        expect(getByText('Request a callback')).toBeInTheDocument()
      })
    })
  })
})
