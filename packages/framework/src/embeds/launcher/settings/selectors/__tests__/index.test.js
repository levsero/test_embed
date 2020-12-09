import {
  getSettingsLauncherLabel,
  getSettingsLauncherChatLabel,
  getSettingsLauncherTalkLabel,
  getLauncherTalkLabel,
  getLauncherChatLabel,
  getLauncherLabel
} from '../'

describe('getSettingsLauncherLabel', () => {
  it('returns the label within the launcher settings object', () => {
    expect(
      getSettingsLauncherLabel({ settings: { launcher: { settings: { label: 'testLabel' } } } })
    ).toEqual('testLabel')
  })
})

describe('getSettingsLauncherChatLabel', () => {
  it('returns the chat label within the launcher settings object', () => {
    expect(
      getSettingsLauncherChatLabel({
        settings: { launcher: { settings: { chatLabel: 'testChatLabel' } } }
      })
    ).toEqual('testChatLabel')
  })
})

describe('getSettingsLauncherTalkLabel', () => {
  it('returns the talk label within the launcher settings object', () => {
    expect(
      getSettingsLauncherTalkLabel({
        settings: { launcher: { settings: { talkLabel: 'testTalkLabel' } } }
      })
    ).toEqual('testTalkLabel')
  })
})

describe('getLauncherTalkLabel', () => {
  describe('when override talkLabel setting has been given', () => {
    it('returns the overriden talk label if it matches the locale', () => {
      expect(
        getLauncherTalkLabel.resultFunc({ '*': 'test' }, 'embeddable_framework.talk.form.title')
      ).toMatchInlineSnapshot(`"test"`)
    })
  })

  describe('when override talkLabel setting has not been given', () => {
    it('returns the translated talkTitleKey', () => {
      expect(
        getLauncherTalkLabel.resultFunc({}, 'embeddable_framework.talk.form.title')
      ).toMatchInlineSnapshot(`"Request a callback"`)
    })
  })
})

describe('getLauncherChatLabel', () => {
  describe('when override chatLabel setting has been given', () => {
    it('returns the overriden chat label if it matches the locale', () => {
      expect(getLauncherChatLabel.resultFunc({ '*': 'test' })).toMatchInlineSnapshot(`"test"`)
    })
  })

  describe('when override chatLabel setting has not been given', () => {
    it('returns the translated default label', () => {
      expect(getLauncherChatLabel.resultFunc({})).toMatchInlineSnapshot(`"Chat"`)
    })
  })
})

describe('getLauncherLabel', () => {
  describe('when override label setting has been given', () => {
    it('returns the overriden label if it matches the locale', () => {
      expect(
        getLauncherLabel.resultFunc({ '*': 'test' }, '', 'embeddable_framework.talk.form.title')
      ).toMatchInlineSnapshot(`"test"`)
    })
  })

  describe('when override label setting has not been given', () => {
    it('returns the translated default label', () => {
      expect(
        getLauncherLabel.resultFunc({}, '', 'embeddable_framework.talk.form.title')
      ).toMatchInlineSnapshot(`"Request a callback"`)
    })
  })
})
