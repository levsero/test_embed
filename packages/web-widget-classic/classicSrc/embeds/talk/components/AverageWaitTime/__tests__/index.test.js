import { render } from '@testing-library/react'
import AverageWaitTime from '../'

test('renders the component', () => {
  const { container } = render(<AverageWaitTime>Average wait time: 1 minute</AverageWaitTime>)

  expect(container).toMatchSnapshot()
})
