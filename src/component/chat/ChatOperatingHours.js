import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Dropdown } from 'component/field/Dropdown';
import { timeFromMinutes } from 'utility/time';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatOperatingHours.scss';
import classNames from 'classnames';

export class ChatOperatingHours extends Component {
  static propTypes = {
    operatingHours: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = { activeDepartment: null };
  }

  daysOfTheWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  hourRange = (range) => {
    const am = _.trim(i18n.t('embeddable_framework.chat.operatingHours.label.am'));
    const pm = _.trim(i18n.t('embeddable_framework.chat.operatingHours.label.pm'));
    const open = timeFromMinutes(range.start, am, pm);
    const closed = timeFromMinutes(range.end, am, pm);

    return i18n.t(
      'embeddable_framework.chat.operatingHours.label.hourRange',
      {
        openingHour: open.time,
        openingPeriod: open.period,
        closingHour: closed.time,
        closingPeriod: closed.period
      }
    );
  }

  departments = () => {
    const { department_schedule: schedule } = this.props.operatingHours;

    return schedule.map((schedule) => {
      const dept = {
        name: schedule.name,
        value: schedule.id
      };

      return dept;
    });
  }

  departmentSchedules = () => {
    const { department_schedule: schedule } = this.props.operatingHours;
    const departmentKey = this.state.activeDepartment;

    const selectedSchedule = _.find(schedule, (d) => d.id == departmentKey); // eslint-disable-line eqeqeq

    return this.renderSchedule(selectedSchedule, `${departmentKey}`);
  }

  renderDayName = (dayName) => {
    return i18n.t(`embeddable_framework.chat.operatingHours.label.${dayName}`);
  }

  renderHours = (index, schedule) => {
    const hours = schedule[index][0];
    const range = hours ? this.hourRange(hours) : i18n.t('embeddable_framework.chat.operatingHours.label.closed');

    return range;
  }

  renderSchedule = (schedule) => {
    const dlClassNames = classNames(
      styles.dayList
    );

    return(
      <dl className={dlClassNames}>
        {this.daysOfTheWeek.reduce((accumulator, day, index) => {
          return accumulator.concat([
            <dt className={styles.dayName} key={`dt-${index}`}>{this.renderDayName(day)}</dt>,
            <dd className={styles.hours} key={`dd-${index}`}>
              {this.renderHours(index, schedule)}
            </dd>
          ]);
        }, [])}
      </dl>
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

    const departments = this.departments();

    if (!this.state.activeDepartment) { this.state.activeDepartment = departments[0].value; }

    return (
      <div>
        <Dropdown
          className={styles.dropdown}
          menuContainerClassName={styles.dropdownMenuContainer}
          label={i18n.t('embeddable_framework.chat.preChat.online.dropdown.selectDepartment')}
          required={false}
          name='department'
          options={departments}
          value={departments[0]}
          onChange={this.setActiveDepartment}
        />
        {this.departmentSchedules()}
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

    return (
      <div className={styles.container}>
        <h4 className={styles.title} dangerouslySetInnerHTML={{__html: title}} />
        {this.renderAccountSchedule()}
        {this.renderDepartmentSchedule()}
      </div>
    );
  }
}
