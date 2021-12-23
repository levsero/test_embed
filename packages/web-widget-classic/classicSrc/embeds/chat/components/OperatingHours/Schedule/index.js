import PropTypes from 'prop-types'
import ApplicableDays from './ApplicableDays'
import HoursForApplicableDays from './HoursForApplicableDays'
import { DayList } from './styles'

const Schedule = ({ schedule, locale }) => (
  <DayList>
    {schedule.map((item, index) => {
      return (
        <div key={index}>
          <ApplicableDays days={item.days} key={`dt-${index}`} />
          <HoursForApplicableDays periods={item.periods} key={`gp-${index}`} locale={locale} />
        </div>
      )
    })}
  </DayList>
)

Schedule.propTypes = {
  schedule: PropTypes.arrayOf(
    PropTypes.shape({
      days: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
      periods: PropTypes.arrayOf(
        PropTypes.shape({
          start: PropTypes.number,
          end: PropTypes.number,
        })
      ),
    })
  ).isRequired,
  locale: PropTypes.string.isRequired,
}

export default Schedule
