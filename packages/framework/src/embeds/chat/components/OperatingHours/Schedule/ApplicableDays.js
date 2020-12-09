import React from 'react'
import PropTypes from 'prop-types'
import useTranslate from 'src/hooks/useTranslate'
import { DayName } from './styles'

const ApplicableDays = ({ days }) => {
  const translate = useTranslate()
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

  return (
    <DayName>
      {days
        .map(day => {
          if (Array.isArray(day)) {
            return day
              .map(nameOfDay)
              .join(translate('embeddable_framework.chat.operatingHours.label.separator.range'))
          } else {
            return nameOfDay(day)
          }
        })
        .join(translate('embeddable_framework.chat.operatingHours.label.separator.overall'))}
    </DayName>
  )
}

ApplicableDays.propTypes = {
  days: PropTypes.oneOfType([PropTypes.array, PropTypes.number])
}

export default ApplicableDays
