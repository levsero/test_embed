function _zeroPad(number) {
  if (number < 10) {
    return `0${Math.floor(number)}`;
  }
  return `${number}`;
}

function _formatHours(number, is24Hour) {
  if (!is24Hour && number > 12) {
    return  _zeroPad(number - 12);
  }
  return _zeroPad(number);
}

function timeFromMinutes(minuteString, am, pm) {
  const minutesFromMidnight = parseInt(minuteString, 10);
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;
  const is24Hour = (am === '' || pm === '');
  const amOrPm = hours >= 12 ? pm : am;
  const period = !is24Hour ? amOrPm : '';

  return {
    time: `${_formatHours(hours, is24Hour)}:${_zeroPad(minutes)}`,
    is24Hour: is24Hour,
    period: period
  };
}

export { timeFromMinutes };
