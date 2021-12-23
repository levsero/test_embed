import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { render } from 'classicSrc/util/testHelpers'
import transformTime from '../useTransformTime'

describe('useTransformTime', () => {
  // eslint-disable-next-line react/prop-types
  const SomeComponent = ({ time }) => {
    i18n.getLocale = jest.fn().mockImplementation(() => 'en')
    const result = transformTime(time)

    return <div>{result}</div>
  }

  it('calculates seconds correctly', () => {
    const { queryByText } = render(<SomeComponent time={1} />)

    expect(queryByText('00:01')).toBeInTheDocument()
  })
  it('calculates minutes correctly from seconds', () => {
    const { queryByText } = render(<SomeComponent time={61} />)

    expect(queryByText('01:01')).toBeInTheDocument()
  })

  it('calculates tens of minutes correctly from seconds', () => {
    const { queryByText } = render(<SomeComponent time={601} />)

    expect(queryByText('10:01')).toBeInTheDocument()
  })
})
