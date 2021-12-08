import useTranslate from 'classicSrc/hooks/useTranslate'
import { i18nTimeFromMinutes } from 'classicSrc/util/time'
import PropTypes from 'prop-types'
import { LastTiming, Hours } from './styles'

const HoursForApplicableDays = ({ periods, locale }) => {
  const translate = useTranslate()

  if (periods.length === 0) {
    return (
      <LastTiming key={`dd--closed`}>
        {translate('embeddable_framework.chat.operatingHours.label.closed')}
      </LastTiming>
    )
  }

  return periods.map((hours, index) => {
    const lastTiming = index === periods.length - 1

    return (
      <Hours key={`dd-${index}`} lastTiming={lastTiming}>
        {hours.start === 0 && hours.end === 1440
          ? translate('embeddable_framework.chat.operatingHours.label.openAllDay')
          : translate('embeddable_framework.chat.operatingHours.label.timeRange', {
              openingTime: i18nTimeFromMinutes(hours.start, locale),
              closingTime: i18nTimeFromMinutes(hours.end, locale),
            })}
      </Hours>
    )
  })
}

HoursForApplicableDays.propTypes = {
  periods: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.number,
      end: PropTypes.number,
    })
  ),
  locale: PropTypes.string.isRequired,
}

export default HoursForApplicableDays
