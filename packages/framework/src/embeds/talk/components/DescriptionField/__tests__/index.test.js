import { render } from '@testing-library/react'
import DescriptionField from '../'

test('DescriptionField', () => {
  const { container } = render(
    <DescriptionField
      label="This is a description field"
      defaultValue="this value should be populated"
    />
  )

  expect(container).toMatchSnapshot()
})
