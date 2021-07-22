import { styleSheetSerializer } from 'jest-styled-components/serializer'
import snapshotDiff from 'snapshot-diff'
import { render } from 'src/util/testHelpers'
import ButtonPill from '../'

snapshotDiff.setSerializers([...snapshotDiff.defaultSerializers, styleSheetSerializer])
expect.addSnapshotSerializer(styleSheetSerializer)

const renderComponent = (props, themeProps = { rtl: false }) => {
  return render(<ButtonPill {...props}>mylabel</ButtonPill>, { themeProps })
}

test('renders the expected classes', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

test('renders the expected rtl classes when rtl is on', () => {
  const { container: ltrContainer } = renderComponent()
  const { container: rtlContainer } = renderComponent({}, { rtl: true })

  expect(snapshotDiff(ltrContainer, rtlContainer, { contextLines: 0 })).toMatchSnapshot()
})
