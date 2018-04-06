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

  renderHours = (index) => {
    const { operatingHours } = this.props;
    // This line will need to change when we add departments:
    const hours = operatingHours.account_schedule[index][0];
    const range = hours ? this.hourRange(hours) : 'Closed';

    return range;
  }

  renderDays = () => {
    return(
      <dl className={styles.dayList}>
        {this.daysOfTheWeek.reduce((accumulator, day, index) => {
          return accumulator.concat([
            <dt className={styles.dayName} key={`dt-${index}`}>{this.renderDayName(day)}</dt>,
            <dd className={styles.hours} key={`dd-${index}`}>{this.renderHours(index)}</dd>
          ]);
        }, [])}
      </dl>
    );
  }

  renderBackButton = () => {
    const backButtonLabel = 'Go Back';

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
      { timezone: operatingHours.timezone }
    );

    return (
      <div className={styles.container}>
        <h4 className={styles.title}>{title}</h4>
        {this.renderDays()}
        {this.renderBackButton()}
      </div>
    );
  }
}
