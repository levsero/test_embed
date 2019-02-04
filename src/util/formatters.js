import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/fn/symbol/iterator';
import 'core-js/fn/number/is-nan';
import 'core-js/es6/array';
import 'core-js/fn/string/virtual/starts-with';
import 'core-js/fn/string/virtual/repeat';
import 'core-js/fn/math/trunc';

import { i18n } from 'service/i18n';

export function dateTime(luxon, timestamp, opts = {}) {
  const { DateTime } = luxon;
  const ts = toDateTime(DateTime, timestamp);

  if (opts.showToday) {
    const onSameDay = ts.hasSame(Date.now(), 'days');

    if (onSameDay) {
      const timeFormat = ts.toLocaleString(DateTime.TIME_SIMPLE);

      return i18n.t('embeddable_framework.common.today', { time: timeFormat });
    }
  }
  return ts.toLocaleString(DateTime.DATETIME_MED);
}

function toDateTime(DateTime, timestamp) {
  let locale = i18n.getLocale();
  let ts = DateTime.fromMillis(timestamp);

  try {
    return ts.setLocale(locale);
  } catch (_) {
    // in case supplied locale is not supported
    return ts.setLocale('en');
  }
}
