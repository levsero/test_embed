import { render } from 'react-testing-library'
import React from 'react'

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
