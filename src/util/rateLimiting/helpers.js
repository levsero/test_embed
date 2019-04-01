import { store } from 'service/persistence';
import _ from 'lodash';

const RATE_LIMITING_QUEUES ='rateRimitingQueues';

let queues = _.get(store.get('store'), RATE_LIMITING_QUEUES, {});

export const queuesReset = () => { queues = {}; };

export const exponentialBackoffTime = (attempts) => {
  const numberOfAttempts = attempts.length - 1;

  if (numberOfAttempts < 1) return 0;
  if (numberOfAttempts === 1) return 1000;
  const initialDelay = 1000;

  return (initialDelay * Math.pow(2, numberOfAttempts));
};

export const isRateLimited = (queueName, timestamp) => {
  queues[queueName] = queues[queueName] || [];
  const times = queues[queueName];
  const previousAttempt = times[times.length - 1];
  const timeSinceLastAttempt = previousAttempt ? timestamp - previousAttempt : 0;

  if (previousAttempt) {
    // Reset after 2 hours
    const hours = 2;
    const delayThreshold = hours * 60 * 60 * 1000;

    if (timeSinceLastAttempt > delayThreshold) times.length = 0;
  }

  const timeToWait = exponentialBackoffTime(times);

  if (previousAttempt && timeToWait > timeSinceLastAttempt) {
    return true;
  }

  times.push(timestamp);
  store.set(RATE_LIMITING_QUEUES, queues);
  return false;
};
