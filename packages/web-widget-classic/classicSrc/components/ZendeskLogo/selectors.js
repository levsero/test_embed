import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { getZopimId, getLocale } from 'classicSrc/redux/modules/base/base-selectors'
import { getZendeskHost, document } from '@zendesk/widget-shared-services'

export const getZendeskLogoLink = (state, linkToChat) => {
  const zopimId = getZopimId(state)
  const locale = getLocale(state)

  if (linkToChat) {
    const params = [
      '?utm_source=webwidgetchat',
      '&utm_medium=poweredbyzendeskchat',
      '&utm_campaign=poweredbyzendesk',
      `&utm_term=${zopimId}`,
      `&utm_content=${getZendeskHost(document)}`,
      `&iref=${zopimId}`,
      `&lang=${locale}`,
    ].join('')

    return [i18n.t('embeddable_framework.zendeskLogo.powered_by_url.chat'), params].join('')
  }

  return [
    i18n.t('embeddable_framework.zendeskLogo.powered_by_url.embeddables'),
    '?utm_source=webwidget&utm_medium=poweredbyzendesk&utm_campaign=image',
  ].join('')
}
