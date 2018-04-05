import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { trim } from 'lodash';
import { Button } from 'component/button/Button';
import { timeFromMinutes } from 'utility/time';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatOperatingHours.scss';

export class ChatOperatingHours extends Component {
  static propTypes = {
    operatingHours: PropTypes.object.isRequired,
    handleOfflineFormBack: PropTypes.func.isRequired
  };

  daysOfTheWeek = [
    i18n.t('embeddable_framework.chat.operatingHours.label.sunday'),
    i18n.t('embeddable_framework.chat.operatingHours.label.monday'),
    i18n.t('embeddable_framework.chat.operatingHours.label.tuesday'),
    i18n.t('embeddable_framework.chat.operatingHours.label.wednesday'),
    i18n.t('embeddable_framework.chat.operatingHours.label.thursday'),
    i18n.t('embeddable_framework.chat.operatingHours.label.friday'),
    i18n.t('embeddable_framework.chat.operatingHours.label.saturday')
  ];

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

  renderSingleDay = (dayName, index) => {
    const { operatingHours } = this.props;
    // This line will need to change when we add departments:
    const hours = operatingHours.account_schedule[index][0];
    const range = hours ? this.hourRange(hours) : 'Closed';

    return(
      <li className={styles.singleDay} key={index}>
        <h5 className={styles.dayName}>{dayName}</h5>
        <p>{range}</p>
      </li>
    );
  }

  renderDays = () => {
    return this.daysOfTheWeek.map((day, index) => this.renderSingleDay(day, index));
  }

  renderBackButton = () => {
    const backButtonLabel = 'Go Back';

    return(
      <Button
        className={styles.button}
        label={backButtonLabel}
        onClick={() => {this.props.handleOfflineFormBack();}}
        type='button' />
    );
  }

  render = () => {
    const { operatingHours } = this.props;
    const title = i18n.t(
      'embeddable_framework.chat.operatingHours.label.title',
      { timezone: operatingHours.timezone }
    );

    return (
      <div className={styles.container}>
        <h4 className={styles.title}>{title}</h4>
        <ul>{this.renderDays()}</ul>
        {this.renderBackButton()}
      </div>
    );
  }
}
