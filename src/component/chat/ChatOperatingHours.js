import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Button } from '@zendeskgarden/react-buttons';
import {
  Select,
  SelectField,
  Label,
  Item } from '@zendeskgarden/react-select';
import { i18nTimeFromMinutes } from 'utility/time';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatOperatingHours.scss';
import { FONT_SIZE } from 'src/constants/shared';

export class ChatOperatingHours extends Component {
  static propTypes = {
    operatingHours: PropTypes.object.isRequired,
    getFrameContentDocument: PropTypes.func.isRequired,
    handleOfflineFormBack: PropTypes.func.isRequired
  };

  static defaultProps = {
    getFrameContentDocument: () => ({})
  };

  constructor(props, context) {
    super(props, context);

    this.state = { activeDepartment: null };
  }

  componentWillMount = () => {
    if (this.props.operatingHours.department_schedule) {
      this.setState({
        activeDepartment: this.getDefaultDepartment()
      });
    }
  }

  daysOfTheWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  hourRange = (range) => {
    const open = i18nTimeFromMinutes(range.start, this.i18nDateTimeFormat);
    const closed = i18nTimeFromMinutes(range.end, this.i18nDateTimeFormat);

    // special state for when operating hours are for the full day
    return (range.start === 0 && range.end === 1440) ?
      i18n.t('embeddable_framework.chat.operatingHours.label.openAllDay') :
      i18n.t(
        'embeddable_framework.chat.operatingHours.label.timeRange',
        {
          openingTime: open,
          closingTime: closed
        }
      );
  }

  getDefaultDepartment = () => {
    const { department_schedule: departmentSchedule } = this.props.operatingHours;

    return _.first(departmentSchedule).id.toString();
  }

  formatDepartmentsForDropdown = () => {
    const { department_schedule: departmentSchedule } = this.props.operatingHours;

    return departmentSchedule.map((deptSchedule) => {
      return <Item key={deptSchedule.id}>{deptSchedule.name}</Item>;
    });
  }

  getSelectedDepartmentSchedule = () => {
    const { department_schedule: schedule } = this.props.operatingHours;
    const departmentKey = this.state.activeDepartment;

    return _.find(schedule, (d) => { return d.id.toString() === departmentKey;} );
  }

  renderHours = (daySchedule, dayScheduleIndex) => {
    return daySchedule.map((hours, index) => {
      const range = this.hourRange(hours);
      const timingStyle = index === daySchedule.length - 1 ? styles.lastTiming : '';

      return (
        <dd key={`dd-${dayScheduleIndex}-${index}`} className={timingStyle}>
          {range}
        </dd>
      );
    });
  }

  renderDayName = (dayName, index) => {
    return (
      <dt className={styles.dayName}
        key={`dt-${index}`}>
        {i18n.t(`embeddable_framework.chat.operatingHours.label.${dayName}`)}
      </dt>
    );
  }

  renderSchedule = (schedule) => {
    const dayElems = this.daysOfTheWeek.reduce((listElemItems, day, index) => {
      const dayName = this.renderDayName(day, index);
      const closed = (
        <dd key={`dd-${index}-closed`} className={styles.lastTiming}>
          {i18n.t('embeddable_framework.chat.operatingHours.label.closed')}
        </dd>
      );
      const hourTimings = (schedule[index].length > 0)
        ? this.renderHours(schedule[index], index)
        : [closed];

      return listElemItems.concat([dayName, ...hourTimings]);
    }, []);

    return (
      <dl className={styles.dayList}>
        {dayElems}
      </dl>
    );
  }

  renderBackButton = () => {
    return (
      <Button
        primary={true}
        className={styles.button}
        onClick={this.props.handleOfflineFormBack}>
        {i18n.t('embeddable_framework.common.button.goBack')}
      </Button>
    );
  }

  renderAccountSchedule = () => {
    const { operatingHours } = this.props;

    if (!operatingHours.account_schedule) return;

    return this.renderSchedule(operatingHours.account_schedule);
  }

  renderDepartmentSchedule = () => {
    const { operatingHours } = this.props;

    if (!operatingHours.department_schedule) return;

    const departments = this.formatDepartmentsForDropdown();
    const selectedDepartmentSchedule = this.getSelectedDepartmentSchedule();

    return (
      <div>
        <SelectField>
          <Label>
            {i18n.t('embeddable_framework.chat.form.common.dropdown.chooseDepartment')}
          </Label>
          <Select
            name='department'
            selectedKey={String(this.state.activeDepartment)}
            appendToNode={this.props.getFrameContentDocument().body}
            onChange={this.setActiveDepartment}
            popperModifiers={{ flip: { enabled: false }, preventOverflow: { escapeWithReference: true } }}
            dropdownProps={{ style: { maxHeight: `${140/FONT_SIZE}rem`, overflow: 'auto' }}}
            options={departments}>
            {selectedDepartmentSchedule.name}
          </Select>
        </SelectField>
        {this.renderSchedule(selectedDepartmentSchedule)}
      </div>
    );
  }

  setActiveDepartment = (departmentId) => {
    this.setState({ activeDepartment: departmentId });
  }

  render = () => {
    const { operatingHours } = this.props;
    const title = i18n.t(
      'embeddable_framework.chat.operatingHours.label.title',
      { timezone: `<span>(${operatingHours.timezone})</span>` }
    );

    this.i18nDateTimeFormat = Intl.DateTimeFormat(i18n.getLocale(), {
      hour: 'numeric',
      minute: 'numeric'
    });

    return (
      <div className={styles.container}>
        <h4 className={styles.title} dangerouslySetInnerHTML={{__html: title}} />
        {this.renderAccountSchedule()}
        {this.renderDepartmentSchedule()}
        {this.renderBackButton()}
      </div>
    );
  }
}
