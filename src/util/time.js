function zeroPad(number) {
  return (number < 10) ? `0${number}` : `${number}`;
}

function formatHours(number, is24Hour) {
  const hours = (!is24Hour && number > 12) ? number - 12 : number;

  return zeroPad(hours);
}

function timeFromMinutes(minuteString, am, pm) {
  const minutesFromMidnight = parseInt(minuteString, 10);
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;
  const is24Hour = !am || !pm;
  const amOrPm = hours >= 12 ? pm : am;
  const period = !is24Hour ? amOrPm : '';

  return {
    time: `${formatHours(hours, is24Hour)}:${zeroPad(minutes)}`,
    is24Hour: is24Hour,
    period: period
  };
}

export { timeFromMinutes };
