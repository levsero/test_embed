import { render } from 'classicSrc/util/testHelpers'
import { Component as OperatingHoursPage } from '../'

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

const renderComponent = (props = {}) => {
  const defaultProps = {
    operatingHours: mockAccountOperatingHours,
    handleOfflineFormBack: jest.fn(),
    title: 'Chat with us',
    locale: 'en-us',
  }

  return render(<OperatingHoursPage {...defaultProps} {...props} />)
}

it('renders the operatingHours', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Monday')).toBeInTheDocument()
  expect(queryByText('7:36 AM to 1:09 PM')).toBeInTheDocument()
})

test('renders the title', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Chat with us')).toBeInTheDocument()
})

test('navigates to the chatting screen when back button is clicked', () => {
  const handleOfflineFormBack = jest.fn()

  const { queryByText } = renderComponent({ handleOfflineFormBack })

  queryByText('Go Back').click()

  expect(handleOfflineFormBack).toHaveBeenCalledTimes(1)
})
