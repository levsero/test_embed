import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import bedrockCSS from '@zendeskgarden/css-bedrock'
import {
  ThemeProvider as SuncoThemeProvider,
  MESSAGE_STATUS
} from '@zendesk/conversation-components'
import { useCurrentFrame } from 'src/framework/components/Frame'
import { getMessengerColors } from 'src/apps/messenger/features/themeProvider/store'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { baseFontSize, baseFontSizeFullScreen } from 'src/apps/messenger/constants'
import { createGlobalStyle } from 'styled-components'
import i18n from 'src/framework/services/i18n'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'

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

  return (
    <SuncoThemeProvider
      currentFrame={frame}
      primaryColor={messengerColors.primary}
      messageColor={messengerColors.message}
      actionColor={messengerColors.action}
      baseFontSize={currentBaseFontSize}
      rtl={i18n.isRTL()}
      labels={{
        receipts: {
          receivedRecently: translate(
            'embeddable_framework.messenger.message.receipt.received_recently'
          ),
          status: {
            [MESSAGE_STATUS.sending]: translate('embeddable_framework.messenger.receipt.sending'),
            [MESSAGE_STATUS.sent]: translate('embeddable_framework.messenger.receipt.sent'),
            [MESSAGE_STATUS.failed]: translate('embeddable_framework.messenger.receipt.retry')
          }
        },
        composer: {
          placeholder: translate('embeddable_framework.messenger.composer.placeholder'),
          inputAriaLabel: translate('embeddable_framework.messenger.composer.label'),
          sendButtonTooltip: translate(
            'embeddable_framework.messenger.composer.send_button_tooltip'
          ),
          sendButtonAriaLabel: translate(
            'embeddable_framework.messenger.composer.send_button_label'
          )
        },
        fileMessage: {
          sizeInKB: size =>
            translate('embeddable_framework.messenger.message.file.size_in_kb', { size }),
          sizeInMB: size =>
            translate('embeddable_framework.messenger.message.file.size_in_mb', { size }),
          downloadAriaLabel: translate('embeddable_framework.messenger.message.file.download')
        },
        messengerHeader: {
          avatarAltTag: translate('embeddable_framework.messenger.header.company_logo'),
          closeButtonAriaLabel: translate('embeddable_framework.messenger.header.close')
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
              totalSteps
            }),
          errors: {
            requiredField: translate(
              'embeddable_framework.messenger.message.form.field_is_required'
            ),
            invalidEmail: translate('embeddable_framework.messenger.message.form.invalid_email'),
            fieldMinSize: min =>
              translate('embeddable_framework.messenger.message.form.invalid_min_characters', {
                count: min
              }),
            fieldMaxSize: max => {
              return max === 1
                ? translate(
                    'embeddable_framework.messenger.message.form.invalid_max_characters.one',
                    {
                      count: max
                    }
                  )
                : translate(
                    'embeddable_framework.messenger.message.form.invalid_max_characters.other',
                    {
                      count: max
                    }
                  )
            }
          }
        },
        launcher: {
          ariaLabel: translate('embeddable_framework.messenger.launcher.button')
        }
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
  children: PropTypes.node
}

export default ThemeProvider
