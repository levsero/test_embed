function zeroPad(number) {
  return (number < 10) ? `0${number}` : `${number}`;
}

function formatHours(number, is24Hour) {
  let hours;

  if (is24Hour) {
    hours = number === 24 ? 0 : number;
  } else {
    if (number === 0) {
      hours = 12;
    } else {
      hours = number > 12 ? number - 12 : number;
    }
  }

  return zeroPad(hours);
}

function timeFromMinutes(minuteString, am, pm) {
  const minutesFromMidnight = parseInt(minuteString, 10);
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;
  const is24Hour = !am || !pm;
  const amOrPm = hours >= 12 && hours !== 24 ? pm : am;
  const period = !is24Hour ? amOrPm : '';

  return {
    time: `${formatHours(hours, is24Hour)}:${zeroPad(minutes)}`,
    is24Hour: is24Hour,
    period: period
  };
}

function i18nTimeFromMinutes(minuteString, formatter) {
  const minutesFromMidnight = parseInt(minuteString, 10);
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;

  return formatter.format(new Date(2018, 10, 15, hours, minutes, 0));
}

export { timeFromMinutes, i18nTimeFromMinutes };
