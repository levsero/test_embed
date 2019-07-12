import { render } from '@testing-library/react'
import React from 'react'

import NameField from '../'

test('NameField', () => {
  const { container } = render(
    <NameField label="This is a name field" defaultValue="this value should be populated" />
  )

  expect(container).toMatchSnapshot()
})
