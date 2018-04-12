import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { trim, keys } from 'lodash';
import { Dropdown } from 'component/field/Dropdown';
import { Button } from 'component/button/Button';
import { timeFromMinutes } from 'utility/time';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatOperatingHours.scss';
import classNames from 'classnames';

export class ChatOperatingHours extends Component {
  static propTypes = {
    operatingHours: PropTypes.object.isRequired,
    handleOfflineFormBack: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = { activeDepartment: null };
  }

  daysOfTheWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  hourRange = (range) => {
    const am = trim(i18n.t('embeddable_framework.chat.operatingHours.label.am'));
    const pm = trim(i18n.t('embeddable_framework.chat.operatingHours.label.pm'));
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

  renderDayName = (dayName) => {
    return i18n.t(`embeddable_framework.chat.operatingHours.label.${dayName}`);
  }

  renderHours = (index, schedule) => {
    const hours = schedule[index][0];
    const range = hours ? this.hourRange(hours) : i18n.t('embeddable_framework.chat.operatingHours.label.closed');

    return range;
  }

  renderSchedule = (schedule, departmentKey = 'account') => {
    const dlClassNames = classNames(
      styles.dayList,
      { [styles.hidden]: (departmentKey !== 'account' && this.state.activeDepartment !== departmentKey) }
    );

    return(
      <dl className={dlClassNames} key={`dl-${departmentKey}`}>
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

    const departmentKeys = keys(operatingHours.department_schedule);

    if (!this.state.activeDepartment) { this.state.activeDepartment = departmentKeys[0]; }

    const departments = departmentKeys.map((id) => {
      const dept = {
        name: `Department ${id}`,
        value: id
      };

      return dept;
    });

    const schedules = departmentKeys.map((departmentKey) => {
      const schedule = operatingHours.department_schedule[departmentKey];

      return this.renderSchedule(schedule, `${departmentKey}`);
    });

    return (
      <div>
        <Dropdown
          className={styles.dropdown}
          menuContainerClassName={styles.dropdownMenuContainer}
          label={'DEPARTMENT'}
          required={false}
          name='department'
          options={departments}
          onChange={this.setActiveDepartment}
        />
        {schedules}
      </div>
    );
  }

  setActiveDepartment = (departmentId) => {
    this.setState({ activeDepartment: departmentId });
  }

  renderBackButton = () => {
    const backButtonLabel = i18n.t('embeddable_framework.common.button.goBack');

    return(
      <Button
        className={styles.button}
        label={backButtonLabel}
        onClick={this.props.handleOfflineFormBack}
        type='button' />
    );
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
        {this.renderBackButton()}
      </div>
    );
  }
}
