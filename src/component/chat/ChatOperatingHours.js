import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Button } from 'component/button/Button';
import { Dropdown } from 'component/field/Dropdown';
import { timeFromMinutes } from 'utility/time';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatOperatingHours.scss';

export class ChatOperatingHours extends Component {
  static propTypes = {
    operatingHours: PropTypes.object.isRequired,
    handleOfflineFormBack: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = { activeDepartment: null };
  }

  componentWillMount = () => {
    if (this.props.operatingHours.department_schedule) {
      this.setState({
        activeDepartment: this.formatDepartmentsForDropdown()[0].value
      });
    }
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

  formatDepartmentsForDropdown = () => {
    const { department_schedule: departmentSchedule } = this.props.operatingHours;

    return departmentSchedule.map((deptSchedule) => {
      return {
        name: deptSchedule.name,
        value: deptSchedule.id
      };
    });
  }

  getSelectedDepartmentSchedule = () => {
    const { department_schedule: schedule } = this.props.operatingHours;
    const departmentKey = this.state.activeDepartment;

    return _.find(schedule, (d) => { return d.id === departmentKey;} );
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
    return (
      <dl className={styles.dayList}>
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

  renderBackButton = () => {
    const backButtonLabel = i18n.t('embeddable_framework.common.button.goBack');

    return (
      <Button
        className={styles.button}
        label={backButtonLabel}
        onClick={this.props.handleOfflineFormBack}
        type='button' />
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
        <Dropdown
          className={styles.dropdown}
          menuContainerClassName={styles.dropdownMenuContainer}
          label={i18n.t('embeddable_framework.chat.preChat.online.dropdown.selectDepartment')}
          labelClasses={styles.dropdownLabel}
          required={false}
          name='department'
          options={departments}
          value={departments[0]}
          onChange={this.setActiveDepartment}
        />
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
