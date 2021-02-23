import { MESSAGE_STATUS } from 'src/constants'
import formatTimestamp from './formatTimestamp'

const defaultLabels = {
  composer: {
    placeholder: 'Type a message',
    inputAriaLabel: 'Type a message',
    sendButtonTooltip: 'Send a message',
    sendButtonAriaLabel: 'Send a message',
  },
  fileMessage: {
    sizeInMB: (size) => `${size} MB`,
    sizeInKB: (size) => `${size} KB`,
    downloadAriaLabel: 'Open in a new tab',
  },
  formMessage: {
    nextStep: 'next',
    send: 'send',
    submitting: 'Sending form',
    submissionError: 'Error submitting form. Try again.',
    stepStatus: (activeStep, totalSteps) => `${activeStep} of ${totalSteps}`,
    errors: {
      requiredField: 'This field is required',
      invalidEmail: 'Enter a valid email address',
      fieldMinSize: (min) => `Must be more than ${min} character${min === 1 ? '' : 's'}`,
      fieldMaxSize: (max) => `Must be less than ${max} character${max === 1 ? '' : 's'}`,
    },
  },
  messengerHeader: {
    avatarAltTag: 'Company logo',
    closeButtonAriaLabel: 'Close',
  },
  receipts: {
    status: {
      [MESSAGE_STATUS.sending]: 'Sending',
      [MESSAGE_STATUS.sent]: 'Sent',
      [MESSAGE_STATUS.failed]: 'Tap to retry',
    },
    receivedRecently: 'Just now',
  },
  formatTimestamp,
  launcher: {
    ariaLabel: 'Open messaging window',
  },
}

export default defaultLabels
