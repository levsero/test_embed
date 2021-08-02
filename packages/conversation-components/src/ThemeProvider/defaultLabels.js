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
    channelLinkingMenuAriaLabel: 'Channel linking menu option',
    continueOnChannel: (name) => `Continue on ${name}`,
  },
  otherParticipantLayout: {
    avatarAltTag: 'Agent avatar',
  },
  notification: {
    connectError: "Couldn't connect. Try again.",
    disconnectError: "Couldn't disconnect. Try again.",
  },
  channelLink: {
    whatsapp: {
      title: 'Continue on WhatsApp',
      subtitle: 'Take the conversation to your WhatsApp account. You can return anytime.',
      instructions: {
        desktop: 'Scan the QR code and then send the message that appears in your WhatsApp.',
        mobile: 'Open WhatsApp and send a short message to connect your account.',
      },
      qrCodeAlt: 'QR code to open WhatsApp on this device',
      button: {
        desktop: 'Open WhatsApp on this device',
        mobile: 'Open WhatsApp',
      },
      disconnectButtonText: 'WhatsApp connected.',
      disconnectLinkText: 'Disconnect',
    },
    messenger: {
      title: 'Continue on Messenger',
      subtitle: 'Take the conversation to your Messenger account. You can return anytime.',
      instructions: {
        desktop: 'Scan the QR code and then send the message that appears in your Messenger.',
        mobile: 'Open Messenger and send a short message to connect your account.',
      },
      qrCodeAlt: 'QR code to open Messenger on this device',
      button: {
        desktop: 'Open Messenger on this device',
        mobile: 'Open Messenger',
      },
      disconnectButtonText: 'Messenger connected.',
      disconnectLinkText: 'Disconnect',
    },
    instagram: {
      title: 'Continue on Instagram',
      subtitle: 'Take the conversation to your Instagram account. You can return anytime.',
      instructions: {
        desktop: 'Scan the QR code to open Instagram. Follow @[Instagram handle] to send a DM.',
        mobile: 'Follow @[Instagram handle] to send a DM.',
      },
      qrCodeAlt: 'QR code to open Instagram on this device',
      button: {
        desktop: 'Open Instagram on this device',
        mobile: 'Open Instagram',
      },
      disconnectButtonText: 'Instagram connected.',
      disconnectLinkText: 'Disconnect',
    },
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
  launcherLabel: {
    ariaLabel: 'Close',
  },
}

export default defaultLabels
