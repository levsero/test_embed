import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import useTranslate from 'src/hooks/useTranslate'
import { i18nTimeFromMinutes } from 'utility/time'
import { DayName, LastTiming, DayList, Hours } from './styles'

const Schedule = ({ schedule, locale }) => {
  const translate = useTranslate()

  const hourRange = range => {
    const open = i18nTimeFromMinutes(range.start, locale)
    const closed = i18nTimeFromMinutes(range.end, locale)

    // special state for when operating hours are for the full day
    return range.start === 0 && range.end === 1440
      ? translate('embeddable_framework.chat.operatingHours.label.openAllDay')
      : translate('embeddable_framework.chat.operatingHours.label.timeRange', {
          openingTime: open,
          closingTime: closed
        })
  }

  const nameOfDay = id => {
    const daysOfTheWeek = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ]

    return translate(`embeddable_framework.chat.operatingHours.label.${daysOfTheWeek[id - 1]}`)
  }

  const hoursForPeriods = (daySchedule, dayScheduleIndex) => {
    return daySchedule.map((hours, index) => {
      const range = hourRange(hours)
      const lastTiming = index === daySchedule.length - 1

      return (
        <Hours key={`dd-${dayScheduleIndex}-${index}`} lastTiming={lastTiming}>
          {range}
        </Hours>
      )
    })
  }

  const applicableDaysFor = (days, index) => {
    const daysString = days
      .map(day => {
        if (Array.isArray(day)) {
          return day
            .map(nameOfDay)
            .join(translate('embeddable_framework.chat.operatingHours.label.separator.range'))
        } else {
          return nameOfDay(day)
        }
      })
      .join(translate('embeddable_framework.chat.operatingHours.label.separator.overall'))

    return <DayName key={`dt-${index}`}>{daysString}</DayName>
  }

  const dailySchedule = _.flatMap(schedule, (item, index) => {
    const applicableDays = applicableDaysFor(item.days, index)
    const closed = (
      <LastTiming key={`dd-${index}-closed`}>
        {translate('embeddable_framework.chat.operatingHours.label.closed')}
      </LastTiming>
    )
    const openingHoursForDays =
      item.periods.length > 0 ? hoursForPeriods(item.periods, index) : [closed]

    return [applicableDays, ...openingHoursForDays]
  })

  return <DayList>{dailySchedule}</DayList>
}

Schedule.propTypes = {
  schedule: PropTypes.arrayOf(
    PropTypes.shape({
      days: PropTypes.arrayOf(PropTypes.number),
      periods: PropTypes.arrayOf(
        PropTypes.shape({
          start: PropTypes.number,
          end: PropTypes.number
        })
      )
    })
  ).isRequired,
  locale: PropTypes.string.isRequired
}

export default Schedule
