function i18nTimeFromMinutes(minuteString, locale = 'en-US') {
  const dateTimeFormat = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric'
  });
  const minutesFromMidnight = parseInt(minuteString, 10);
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;

  return dateTimeFormat.format(new Date(2018, 10, 15, hours, minutes, 0));
}

export { i18nTimeFromMinutes };
