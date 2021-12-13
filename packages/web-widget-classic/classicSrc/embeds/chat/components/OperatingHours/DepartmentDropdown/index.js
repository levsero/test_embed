import _ from 'lodash'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { Dropdown, Menu, Field, Select, Label, Item } from '@zendeskgarden/react-dropdowns'
import { useCurrentFrame } from '@zendesk/widget-shared-services/Frame'
import useTranslate from 'classicSrc/hooks/useTranslate'

const DepartmentDropdown = ({
  departmentSchedule,
  selectedDepartment,
  setSelectedDepartment,
  theme,
}) => {
  const translate = useTranslate()
  const frame = useCurrentFrame()

  const formatDepartmentsForDropdown = () => {
    return departmentSchedule.map((deptSchedule) => {
      return (
        <Item key={deptSchedule.id} value={String(deptSchedule.id)}>
          {deptSchedule.name}
        </Item>
      )
    })
  }

  const getSelectedDepartmentSchedule = () => {
    return _.find(departmentSchedule, (d) => {
      return d.id.toString() === selectedDepartment
    })
  }

  const departments = formatDepartmentsForDropdown()
  const { name } = getSelectedDepartmentSchedule()
  return (
    <Dropdown
      name="department"
      selectedItem={String(selectedDepartment)}
      onSelect={(department) => setSelectedDepartment(department)}
      downshiftProps={{
        environment: frame.window,
      }}
    >
      <Field>
        <Label>
          {translate('embeddable_framework.chat.form.common.dropdown.chooseDepartment')}
        </Label>
        <Select>{name}</Select>
      </Field>
      <Menu
        style={{ maxHeight: `${140 / theme.fontSize}rem`, overflow: 'auto' }}
        popperModifiers={{
          flip: { enabled: false },
          preventOverflow: { escapeWithReference: true },
        }}
      >
        {departments}
      </Menu>
    </Dropdown>
  )
}

DepartmentDropdown.propTypes = {
  departmentSchedule: PropTypes.array.isRequired,
  selectedDepartment: PropTypes.string.isRequired,
  setSelectedDepartment: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    fontSize: PropTypes.number,
  }),
}

export default withTheme(DepartmentDropdown)
