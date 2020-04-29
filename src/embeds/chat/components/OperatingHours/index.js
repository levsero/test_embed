import React, { useState } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Button, Title } from './styles'
import useTranslate from 'src/hooks/useTranslate'
import Schedule from './Schedule'

import DepartmentDropdown from './DepartmentDropdown'

const OperatingHours = ({ operatingHours, handleOfflineFormBack, locale }) => {
  const getDefaultDepartment = () => {
    const { department_schedule: departmentSchedule } = operatingHours

    return _.first(departmentSchedule).id.toString()
  }
  const department = operatingHours.department_schedule ? getDefaultDepartment() : null

  const translate = useTranslate()
  const [selectedDepartment, setSelectedDepartment] = useState(department)

  const getSelectedDepartmentSchedule = () => {
    const { department_schedule: schedule } = operatingHours
    return _.find(schedule, d => {
      return d.id.toString() === selectedDepartment
    }).schedule
  }

  const title = translate('embeddable_framework.chat.operatingHours.label.title', {
    timezone: `<span>(${operatingHours.timezone})</span>`
  })

  const schedule = selectedDepartment
    ? getSelectedDepartmentSchedule()
    : operatingHours.account_schedule

  return (
    <div>
      <Title dangerouslySetInnerHTML={{ __html: title }} />
      {selectedDepartment && (
        <DepartmentDropdown
          departmentSchedule={operatingHours.department_schedule}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />
      )}
      <Schedule schedule={schedule} locale={locale} />
      <Button primary={true} onClick={handleOfflineFormBack}>
        {translate('embeddable_framework.common.button.goBack')}
      </Button>
    </div>
  )
}

OperatingHours.propTypes = {
  operatingHours: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  handleOfflineFormBack: PropTypes.func.isRequired
}

export default OperatingHours
