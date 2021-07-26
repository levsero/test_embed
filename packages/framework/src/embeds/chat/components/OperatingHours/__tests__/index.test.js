import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import OperatingHours from '../'

const mockAccountOperatingHours = {
  account_schedule: [
    {
      days: [1],
      periods: [{ start: 456, end: 789 }],
    },
  ],
  type: 'account',
  enabled: true,
  timezone: 'Australia/Melbourne',
}

const mockDepartmentOperatingHours = {
  department_schedule: [
    {
      name: 'Sales',
      id: 111,
      schedule: [
        {
          days: [2],
          periods: [{ start: 500, end: 600 }],
        },
      ],
    },
    {
      name: 'Billing',
      id: 222,
      schedule: [
        {
          days: [1, [3, 5], 7],
          periods: [{ start: 456, end: 789 }],
        },
        {
          days: [2, 6],
          periods: [],
        },
      ],
    },
  ],
  type: 'department',
  enabled: true,
  timezone: 'Australia/Melbourne',
}

const renderComponent = (inProps) => {
  const props = {
    operatingHours: mockAccountOperatingHours,
    locale: 'en-us',
    handleOfflineFormBack: jest.fn(),
    ...inProps,
  }
  return render(<OperatingHours {...props} />)
}

it('renders single schedule on single day', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Monday')).toBeInTheDocument()
  expect(queryByText('7:36 AM to 1:09 PM')).toBeInTheDocument()
})

it('renders the title', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Operating Hours')).toBeInTheDocument()
  expect(queryByText('(Australia/Melbourne)')).toBeInTheDocument()
})

it('renders the Schedule', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Monday')).toBeInTheDocument()
  expect(queryByText('7:36 AM to 1:09 PM')).toBeInTheDocument()
})

it('renders the go back button', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Go Back')).toBeInTheDocument()
})

it('renders the go back button', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Go Back')).toBeInTheDocument()
})

it('fires handleOfflineFormBack when back button clicked', () => {
  const onBack = jest.fn()
  const { getByText } = renderComponent({
    handleOfflineFormBack: onBack,
  })

  fireEvent.click(getByText('Go Back'))

  expect(onBack).toHaveBeenCalled()
})

describe('with department operating hours', () => {
  it('renders the dropdown', () => {
    const { queryByText } = renderComponent({
      operatingHours: mockDepartmentOperatingHours,
    })

    expect(queryByText('Choose a department')).toBeInTheDocument()
  })

  it('defaults to the first department', () => {
    const { queryByText } = renderComponent({
      operatingHours: mockDepartmentOperatingHours,
    })

    expect(queryByText('Sales')).toBeInTheDocument()
    expect(queryByText('Billing')).not.toBeInTheDocument()

    expect(queryByText('Tuesday')).toBeInTheDocument()
    expect(queryByText('8:20 AM to 10:00 AM')).toBeInTheDocument()
  })
})
