import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/fn/symbol/iterator';
import 'core-js/fn/number/is-nan';
import 'core-js/es6/array';
import 'core-js/fn/string/virtual/starts-with';
import 'core-js/fn/string/virtual/repeat';
import 'core-js/fn/math/trunc';
import { DateTime } from 'luxon';

import { i18n } from 'service/i18n';

export function dateTime(timestamp, opts = {}) {
  const ts = DateTime.fromMillis(timestamp);

  if (opts.showToday) {
    const onSameDay = ts.hasSame(Date.now(), 'days');

    if (onSameDay) {
      const timeFormat = ts.toLocaleString(DateTime.TIME_SIMPLE);

      return i18n.t('embeddable_framework.common.today', { time: timeFormat });
    }
  }
  return ts.toLocaleString(DateTime.DATETIME_MED);
}
