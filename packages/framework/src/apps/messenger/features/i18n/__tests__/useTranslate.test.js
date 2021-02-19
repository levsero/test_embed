import { render } from 'src/apps/messenger/utils/testHelpers'
import useTranslate from '../useTranslate'

describe('useTranslate', () => {
  const SomeComponent = () => {
    const translate = useTranslate()
    const result = translate('embeddable_framework.chat.options.emailTranscript')

    return <div>{result}</div>
  }

  it('returns the translation function which then uses the provided key', () => {
    const { queryByText } = render(<SomeComponent />)

    expect(queryByText('Email transcript')).toBeInTheDocument()
  })
})
