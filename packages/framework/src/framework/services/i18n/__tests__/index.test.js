let i18n
let clientI18NTools

beforeEach(() => {
  jest.resetModules()
  jest.unmock('@zendesk/client-i18n-tools')
  i18n = require('../').default
  clientI18NTools = require('@zendesk/client-i18n-tools')
})

describe('setLocale', () => {
  it('updates the locale when setLocale is called', async () => {
    await i18n.setLocale('ko')

    expect(i18n.getLocale()).toBe('ko')
  })

  it('returns an object with success: true when successful', async () => {
    const result = await i18n.setLocale('ko')

    expect(result).toEqual({ success: true })
  })

  it('returns an object with success: false when it failed', async () => {
    jest.spyOn(clientI18NTools, 'set').mockImplementation(() => {
      throw new Error('something failed')
    })

    const result = await i18n.setLocale('ko')

    expect(result).toEqual({ success: false })
  })

  it('defaults to American English when setLocale is called with an invalid locale', async () => {
    await i18n.setLocale('invalid')

    expect(i18n.getLocale()).toBe('en-us')
  })

  it('notifies all subscribers when the locale was changed', async () => {
    const callback = jest.fn()

    i18n.subscribe(callback)

    await i18n.setLocale('ko')

    expect(callback).toHaveBeenCalled()
  })
})

describe('translate', () => {
  it('returns the translated string', async () => {
    await i18n.setLocale('en-US')
    expect(i18n.translate('embeddable_framework.common.button.chat')).toBe('Live chat')
  })

  it('returns a missing translation string when translation was not found', async () => {
    await i18n.setLocale('en-US')
    expect(i18n.translate('fake.translation')).toBe('Missing translation (en-us): fake.translation')
  })
})

describe('isRTL', () => {
  it('returns true if the current locale is a rtl locale', async () => {
    await i18n.setLocale('ar')
    expect(i18n.isRTL()).toBe(true)
  })

  it('returns false if the current locale is a ltr locale', async () => {
    await i18n.setLocale('en-US')
    expect(i18n.isRTL()).toBe(false)
  })
})
