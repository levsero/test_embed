import { render } from 'src/util/testHelpers'
import Schedule from '../'

const singleScheduleSingleDay = {
  days: [2],
  periods: [{ start: 800, end: 900 }],
}

const singleScheduleMultipleDays = {
  days: [1, [3, 6]],
  periods: [{ start: 456, end: 889 }],
}

const multipleSchedulesSingleDay = {
  days: [7],
  periods: [
    { start: 456, end: 789 },
    { start: 800, end: 901 },
  ],
}

const fullDaySchedule = {
  days: [5],
  periods: [{ start: 0, end: 1440 }],
}

const closedSchedule = {
  days: [5],
  periods: [],
}

const multiDaysAndMultiSchedulesPerDay = [
  singleScheduleMultipleDays,
  singleScheduleSingleDay,
  multipleSchedulesSingleDay,
  fullDaySchedule,
]

const renderComponent = (inProps) => {
  const props = {
    schedule: [],
    locale: 'en-us',
    ...inProps,
  }
  return render(<Schedule {...props} />)
}

it('renders single schedule on single day', () => {
  const { queryByText } = renderComponent({
    schedule: [singleScheduleSingleDay],
  })

  expect(queryByText('Tuesday')).toBeInTheDocument()
  expect(queryByText('1:20 PM to 3:00 PM')).toBeInTheDocument()
})

it('renders when closed', () => {
  const { queryByText } = renderComponent({
    schedule: [closedSchedule],
  })

  expect(queryByText('Friday')).toBeInTheDocument()
  expect(queryByText('Closed')).toBeInTheDocument()
})

it('renders single schedule on multiple days', () => {
  const { queryByText } = renderComponent({ schedule: [singleScheduleMultipleDays] })

  expect(queryByText('Monday, Wednesday — Saturday')).toBeInTheDocument()
  expect(queryByText('7:36 AM to 2:49 PM')).toBeInTheDocument()
})

it('renders multiple schedules on single day', () => {
  const { queryByText } = renderComponent({ schedule: [multipleSchedulesSingleDay] })

  expect(queryByText('Sunday')).toBeInTheDocument()
  expect(queryByText('7:36 AM to 1:09 PM')).toBeInTheDocument()
  expect(queryByText('1:20 PM to 3:01 PM')).toBeInTheDocument()
})

it('renders open all day', () => {
  const { queryByText } = renderComponent({ schedule: [fullDaySchedule] })

  expect(queryByText('Friday')).toBeInTheDocument()
  expect(queryByText('Open all day')).toBeInTheDocument()
})

it('renders all days correctly together', () => {
  const { queryByText } = renderComponent({
    schedule: multiDaysAndMultiSchedulesPerDay,
  })

  expect(queryByText('Monday, Wednesday — Saturday')).toBeInTheDocument()
  expect(queryByText('7:36 AM to 2:49 PM')).toBeInTheDocument()
  expect(queryByText('Tuesday')).toBeInTheDocument()
  expect(queryByText('1:20 PM to 3:00 PM')).toBeInTheDocument()
  expect(queryByText('Sunday')).toBeInTheDocument()
  expect(queryByText('7:36 AM to 1:09 PM')).toBeInTheDocument()
  expect(queryByText('1:20 PM to 3:01 PM')).toBeInTheDocument()
  expect(queryByText('Friday')).toBeInTheDocument()
  expect(queryByText('Open all day')).toBeInTheDocument()
})
