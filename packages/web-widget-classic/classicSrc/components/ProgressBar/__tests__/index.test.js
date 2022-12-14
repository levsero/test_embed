import { render } from 'classicSrc/util/testHelpers'
import ProgressBar from '../'

test('renders with expected classes', () => {
  const { container } = render(<ProgressBar />)

  expect(container).toMatchSnapshot()
})

test('renders with expected classes and width', () => {
  const { container } = render(<ProgressBar percentLoaded={33.33} />)

  expect(container).toMatchSnapshot()
})

test('renders with fake progress bar classes when needed', () => {
  const { container } = render(<ProgressBar percentLoaded={25} fakeProgress={true} />)

  expect(container).toMatchSnapshot()
})
