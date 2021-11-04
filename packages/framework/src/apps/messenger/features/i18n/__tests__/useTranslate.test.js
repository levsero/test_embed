import { render } from 'src/apps/messenger/utils/testHelpers'
import useTranslate from '../useTranslate'

describe('useTranslate', () => {
  const SomeComponent = () => {
    const translate = useTranslate()
    const result = translate('embeddable_framework.messenger.frame.title')

    return <div>{result}</div>
  }

  it('returns the translation function which then uses the provided key', () => {
    const { queryByText } = render(<SomeComponent />)

    expect(queryByText('Messaging window')).toBeInTheDocument()
  })
})
