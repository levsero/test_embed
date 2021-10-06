import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { createGlobalStyle } from 'styled-components'
import bedrockCSS from '@zendeskgarden/css-bedrock'
import {
  ThemeProvider as SuncoThemeProvider,
  MESSAGE_STATUS,
} from '@zendesk/conversation-components'
import { MAX_FILE_SIZE_IN_BYTES } from '@zendesk/sunco-js-client'
import {
  baseFontSize,
  baseFontSizeFullScreen,
  fileUploadCountLimit,
} from 'src/apps/messenger/constants'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { getMessengerColors } from 'src/apps/messenger/features/themeProvider/store'
import { useCurrentFrame } from 'src/framework/components/Frame'
import i18n from 'src/framework/services/i18n'

const GlobalStyles = createGlobalStyle`
  ${bedrockCSS}

  html {
    overflow-y: hidden;
    font-size: initial;
  }
`

const ThemeProvider = ({ children }) => {
  const messengerColors = useSelector(getMessengerColors)
  const isFullScreen = useSelector(getIsFullScreen)
  const currentBaseFontSize = isFullScreen ? baseFontSizeFullScreen : baseFontSize
  const frame = useCurrentFrame()
  const translate = useTranslate()

  useEffect(() => {
    frame.document.documentElement.setAttribute('dir', i18n.isRTL() ? 'rtl' : 'ltr')
    frame.document.documentElement.setAttribute('lang', i18n.getLocale())
  }, [i18n.getLocale()])

  const parseTimestamp = (timestamp) => {
    const currentDate = new Date()
    const messageDate = new Date(timestamp)

    const isToday =
      messageDate.getDate() === currentDate.getDate() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getFullYear() === currentDate.getFullYear()

    return `${messageDate.toLocaleString(i18n.getLocale(), {
      ...(isToday ? {} : { month: 'long', day: 'numeric' }),
      hour: 'numeric',
      minute: 'numeric',
    })}`
  }

  return (
    <SuncoThemeProvider
      currentFrame={frame}
      primaryColor={messengerColors.primary}
      messageColor={messengerColors.message}
      actionColor={messengerColors.action}
      baseFontSize={currentBaseFontSize}
      isFullScreen={isFullScreen}
      rtl={i18n.isRTL()}
      labels={{
        receipts: {
          receivedRecently: translate(
            'embeddable_framework.messenger.message.receipt.received_recently'
          ),
          status: {
            [MESSAGE_STATUS.sending]: translate('embeddable_framework.messenger.receipt.sending'),
            [MESSAGE_STATUS.sent]: translate('embeddable_framework.messenger.receipt.sent'),
            [MESSAGE_STATUS.failed]: translate('embeddable_framework.messenger.receipt.retry'),
          },
          errors: {
            tooMany: translate(
              'embeddable_framework.messenger.file_upload.error.file_count_limit',
              {
                fileUploadCountLimit,
              }
            ),
            fileSize: translate(
              'embeddable_framework.messenger.file_upload.error.file_size_limit',
              {
                fileUploadSizeLimitInMb: MAX_FILE_SIZE_IN_BYTES / (1024 * 1024),
              }
            ),
            unknown: translate('embeddable_framework.messenger.file_upload.tap_to_retry'),
          },
        },
        composer: {
          placeholder: translate('embeddable_framework.messenger.composer.placeholder'),
          inputAriaLabel: translate('embeddable_framework.messenger.composer.label'),
          sendButtonTooltip: translate(
            'embeddable_framework.messenger.composer.send_button_tooltip'
          ),
          sendButtonAriaLabel: translate(
            'embeddable_framework.messenger.composer.send_button_label'
          ),
        },
        fileUpload: {
          uploadButtonAriaLabel: translate(
            'embeddable_framework.messenger.file_upload.upload_button'
          ),
          messageBubbleHover: translate(
            'embeddable_framework.messenger.file_upload.open_image_in_new_tab_v2'
          ),
        },
        fileMessage: {
          sizeInKB: (size) =>
            translate('embeddable_framework.messenger.message.file.size_in_kb', { size }),
          sizeInMB: (size) =>
            translate('embeddable_framework.messenger.message.file.size_in_mb', { size }),
          downloadAriaLabel: translate('embeddable_framework.messenger.message.file.download'),
        },
        messengerHeader: {
          avatarAltTag: translate('embeddable_framework.messenger.header.company_logo'),
          closeButtonAriaLabel: translate('embeddable_framework.messenger.header.close'),
          channelLinkingMenuAriaLabel: translate(
            'embeddable_framework.messenger.channel_linking.menu'
          ),
          continueOnChannel: (name) =>
            translate(
              `embeddable_framework.messenger.header.menu.continue_on_${name.toLowerCase()}`
            ),
        },
        formMessage: {
          nextStep: translate('embeddable_framework.messenger.message.form.next_step'),
          send: translate('embeddable_framework.messenger.message.form.submit'),
          submitting: translate('embeddable_framework.messenger.message.form.submitting'),
          submissionError: translate(
            'embeddable_framework.messenger.message.form.failed_to_submit'
          ),
          stepStatus: (step, totalSteps) =>
            translate('embeddable_framework.messenger.message.form.step_status', {
              step,
              totalSteps,
            }),
          errors: {
            requiredField: translate(
              'embeddable_framework.messenger.message.form.field_is_required'
            ),
            invalidEmail: translate('embeddable_framework.messenger.message.form.invalid_email'),
            fieldMinSize: (min) =>
              translate('embeddable_framework.messenger.message.form.invalid_min_characters', {
                count: min,
              }),
            fieldMaxSize: (max) => {
              return max === 1
                ? translate(
                    'embeddable_framework.messenger.message.form.invalid_max_characters.one',
                    {
                      count: max,
                    }
                  )
                : translate(
                    'embeddable_framework.messenger.message.form.invalid_max_characters.other',
                    {
                      count: max,
                    }
                  )
            },
          },
        },
        launcher: {
          ariaLabel: translate('embeddable_framework.messenger.launcher.button'),
        },
        launcherLabel: {
          ariaLabel: translate('embeddable_framework.messenger.launcher_label.close'),
        },
        formatTimestamp: parseTimestamp,
        messageLog: {
          initialConversationRequestFailed: translate(
            'embeddable_framework.messenger.initial_conversation_request_failed'
          ),
          initialConversationRetry: translate(
            'embeddable_framework.messenger.initial_conversation_retry'
          ),
          initialConversationSpinner: translate(
            'embeddable_framework.messenger.initial_conversation_spinner'
          ),
          messageHistoryRetry: translate('embeddable_framework.messenger.previous_messages_retry'),
          messageHistorySpinner: translate(
            'embeddable_framework.messenger.previous_messages_spinner'
          ),
        },
        notification: {
          connectError: translate(
            'embeddable_framework.messenger.notification.channel_linking.link.failed'
          ),
          disconnectError: translate(
            'embeddable_framework.messenger.notification.channel_linking.unlink.fail'
          ),
        },
        channelLink: {
          linkError: {
            qrError: translate(
              'embeddable_framework.messenger.channel_link.link_error.qr_code_error'
            ),
            buttonError: translate(
              'embeddable_framework.messenger.channel_link.link_error.button_error'
            ),
            retry: translate('embeddable_framework.messenger.file_upload.tap_to_retry'),
          },
          generateNewQrCode: translate(
            'embeddable_framework.messenger.channel_linking.generate_new_qr_code'
          ),
          generateNewLink: translate(
            'embeddable_framework.messenger.channel_linking.generate_new_link'
          ),
          whatsapp: {
            title: translate('embeddable_framework.messenger.channel_linking.page.title.whatsapp'),
            subtitle: translate(
              'embeddable_framework.messenger.channel_linking.page.subtitle.whatsapp'
            ),
            instructions: {
              desktop: () =>
                translate(
                  'embeddable_framework.messenger.channel_linking.page.instructions_desktop.whatsapp'
                ),
              mobile: () =>
                translate(
                  'embeddable_framework.messenger.channel_linking.page.instructions_mobile.whatsapp'
                ),
            },
            qrCodeAlt: translate(
              'embeddable_framework.messenger.channel_linking.page.qr_code.whatsapp'
            ),
            button: {
              desktop: translate(
                'embeddable_framework.messenger.channel_linking.page.button_desktop.whatsapp'
              ),
              mobile: translate(
                'embeddable_framework.messenger.channel_linking.page.button_mobile.whatsapp'
              ),
            },
            disconnectButtonText: translate(
              'embeddable_framework.messenger.channel_link.whatsapp.disconnect_button_text'
            ),
            disconnectLinkText: translate(
              'embeddable_framework.messenger.channel_link.whatsapp.disconnect_link_text'
            ),
          },
          messenger: {
            title: translate(
              'embeddable_framework.messenger.channel_linking.page.title.fb_messenger'
            ),
            subtitle: translate(
              'embeddable_framework.messenger.channel_linking.page.subtitle.fb_messenger'
            ),
            instructions: {
              desktop: () =>
                translate(
                  'embeddable_framework.messenger.channel_linking.page.instructions_desktop.fb_messenger'
                ),
              mobile: () =>
                translate(
                  'embeddable_framework.messenger.channel_linking.page.instructions_mobile.fb_messenger'
                ),
            },
            qrCodeAlt: translate(
              'embeddable_framework.messenger.channel_linking.page.qr_code.fb_messenger'
            ),
            button: {
              desktop: translate(
                'embeddable_framework.messenger.channel_linking.page.button_desktop.fb_messenger'
              ),
              mobile: translate(
                'embeddable_framework.messenger.channel_linking.page.button_mobile.fb_messenger'
              ),
            },
            disconnectButtonText: translate(
              'embeddable_framework.messenger.channel_link.messenger.disconnect_button_text'
            ),
            disconnectLinkText: translate(
              'embeddable_framework.messenger.channel_link.messenger.disconnect_link_text'
            ),
          },
          instagram: {
            title: translate('embeddable_framework.messenger.channel_linking.page.title.instagram'),
            subtitle: translate(
              'embeddable_framework.messenger.channel_linking.page.subtitle.instagram'
            ),
            instructions: {
              desktop: (businessUsername) =>
                translate(
                  'embeddable_framework.messenger.channel_linking.page.instructions_desktop.instagram',
                  { instagramHandle: businessUsername }
                ),
              mobile: (businessUsername) =>
                translate(
                  'embeddable_framework.messenger.channel_linking.page.instructions_mobile.fb_messenger',
                  { instagramHandle: businessUsername }
                ),
            },
            qrCodeAlt: translate(
              'embeddable_framework.messenger.channel_linking.page.qr_code.instagram'
            ),
            button: {
              desktop: translate(
                'embeddable_framework.messenger.channel_linking.page.button_desktop.instagram'
              ),
              mobile: translate(
                'embeddable_framework.messenger.channel_linking.page.button_mobile.instagram'
              ),
            },
            disconnectButtonText: translate(
              'embeddable_framework.messenger.channel_link.instagram.disconnect_button_text'
            ),
            disconnectLinkText: translate(
              'embeddable_framework.messenger.channel_link.instagram.disconnect_link_text'
            ),
          },
        },
      }}
    >
      <>
        <GlobalStyles />

        {children}
      </>
    </SuncoThemeProvider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
}

export default ThemeProvider
