import _ from 'lodash'
import * as selectors from '../settings-selectors'

const settings = (newSettings) => {
  return { settings: newSettings }
}

const chatSettings = (newSettings) => {
  return settings({ chat: newSettings })
}

const talkSettings = (newSettings) => settings({ talk: newSettings })

const launcherSettings = (newSettings) => {
  return settings({ launcher: newSettings })
}

const colorSettings = (newSettings) => {
  return settings({ color: newSettings })
}

const contactOptionsSettings = (newSettings) => settings({ contactOptions: newSettings })

const contactFormSettings = (newSettings) => settings({ contactForm: { settings: newSettings } })

test('getSettingsChatSuppress', () => {
  const result = selectors.getSettingsChatSuppress(chatSettings({ suppress: true }))

  expect(result).toBe(true)
})

test('getRawSettingsChatDepartment', () => {
  const result = selectors.getRawSettingsChatDepartment(
    chatSettings({
      departments: { select: 'Sales' },
    })
  )

  expect(result).toEqual('Sales')
})

describe('getSettingsChatDepartment', () => {
  const callSelector = (testData) =>
    selectors.getSettingsChatDepartment(
      chatSettings({
        departments: { select: testData },
      })
    )

  test.each([
    [1, 1],
    ['sales', 'sales'],
    ['SALES', 'sales'],
    [['Foo', 'Bar'], 'foo,bar'],
    [{ foo: 'bar' }, '[object object]'],
    [undefined, ''],
    [null, ''],
    [true, 'true'],
    [1.5, '1.5'],
  ])('when the input is %p, the output is %p', (value, expected) => {
    expect(callSelector(value)).toEqual(expected)
  })
})

test('getRawSettingsChatDepartmentsEnabled', () => {
  const result = selectors.getRawSettingsChatDepartmentsEnabled(
    chatSettings({
      departments: { enabled: ['Police', 'Fire'] },
    })
  )

  expect(result).toEqual(['Police', 'Fire'])
})

describe('getSettingsChatDepartmentsEnabled', () => {
  const callSelector = (data) => selectors.getSettingsChatDepartmentsEnabled.resultFunc(data)

  test.each([
    [['FIRE'], ['fire']],
    [[12345], [12345]],
    [
      ['Police', 12345],
      ['police', 12345],
    ],
    [[], []],
    [1, undefined],
    ['string', undefined],
    [{ foo: 'bar' }, undefined],
    [
      [[1], 2],
      ['1', 2],
    ],
    [
      [{ a: 'b' }, 1],
      ['[object object]', 1],
    ],
    [
      [true, false],
      ['true', 'false'],
    ],
    [[undefined, null], []],
  ])('when the input is %p, the output is %p', (value, expected) => {
    expect(callSelector(value)).toEqual(expected)
  })
})

test('getSettingsMobileNotificationsDisabled', () => {
  const result = selectors.getSettingsMobileNotificationsDisabled(
    chatSettings({ mobileNotificationsDisabled: true })
  )

  expect(result).toBe(true)
})

test('getSettingsChatTags', () => {
  const result = selectors.getSettingsChatTags(
    chatSettings({
      tags: [1, 2],
    })
  )

  expect(result).toEqual([1, 2])
})

test('getAnalyticsDisabled', () => {
  const result = selectors.getAnalyticsDisabled(
    settings({
      analytics: false,
    })
  )

  expect(result).toEqual(true)
})

test('getSettingsChatConcierge', () => {
  const result = selectors.getSettingsChatConcierge(
    chatSettings({
      concierge: { x: 1 },
    })
  )

  expect(result).toEqual({ x: 1 })
})

test('getSettingsChatTitle', () => {
  const result = selectors.getSettingsChatTitle(
    chatSettings({
      title: { x: 1 },
    })
  )

  expect(result).toEqual({ x: 1 })
})

test('getSettingsChatPrechatForm', () => {
  const result = selectors.getSettingsChatPrechatForm(
    chatSettings({
      prechatForm: { x: 1 },
    })
  )

  expect(result).toEqual({ x: 1 })
})

test('getSettingsChatOfflineForm', () => {
  const result = selectors.getSettingsChatOfflineForm(
    chatSettings({
      offlineForm: { x: 1 },
    })
  )

  expect(result).toEqual({ x: 1 })
})

test('getSettingsChatProfileCard', () => {
  const result = selectors.getSettingsChatProfileCard(
    chatSettings({
      profileCard: { x: 1 },
    })
  )

  expect(result).toEqual({ x: 1 })
})

test('getSettingsChatHideWhenOffline', () => {
  const result = selectors.getSettingsChatHideWhenOffline(
    chatSettings({
      hideWhenOffline: true,
    })
  )

  expect(result).toEqual(true)
})

test('getSettingsColorLauncher', () => {
  const result = selectors.getSettingsColorLauncher(
    colorSettings({
      launcher: 'blue',
    })
  )

  expect(result).toEqual('blue')
})

test('getSettingsColorLauncherText', () => {
  const result = selectors.getSettingsColorLauncherText(
    colorSettings({
      launcherText: 'green',
    })
  )

  expect(result).toEqual('green')
})

test('getSettingsLauncherBadge', () => {
  const badge = {
    layout: 'image_left',
    image: 'https://img.example.com/qwerty.png',
    label: {
      '*': 'cool label',
    },
  }
  const result = selectors.getSettingsLauncherBadge(launcherSettings({ badge }))

  expect(result).toEqual(badge)
})

test('getSettingsColor', () => {
  const mockColor = {
    color: {
      theme: '#123456',
      launcher: '#ffffff',
    },
  }
  const result = selectors.getSettingsColor(settings(mockColor))

  expect(result).toEqual(mockColor.color)
})

test('getStylingOffset', () => {
  const mockSettings = {
    styling: {
      offsetVertical: 10,
      offsetHorizontal: 20,
      offsetMobileVertical: 30,
      offsetMobileHorizontal: 40,
    },
  }
  const result = selectors.getStylingOffset(settings(mockSettings))

  expect(result).toEqual({
    horizontal: 20,
    mobile: {
      horizontal: 40,
      vertical: 30,
    },
    vertical: 10,
  })
})

test('getStylingZIndex', () => {
  const mockSettings = {
    styling: {
      zIndex: 10000,
    },
  }
  const result = selectors.getStylingZIndex(settings(mockSettings))

  expect(result).toEqual(10000)
})

test('getSettingsContactFormTitle', () => {
  const result = selectors.getSettingsContactFormTitle(contactFormSettings({ title: 'hello!' }))

  expect(result).toBe('hello!')
})

test('getSettingsSelectTicketFormLabel', () => {
  const result = selectors.getSettingsSelectTicketFormLabel(
    contactFormSettings({ selectTicketForm: 'hello!' })
  )

  expect(result).toBe('hello!')
})

test('getSettingsChatPopout', () => {
  const mockSettings = {
    chat: {
      title: {
        '*': 'cool chat title',
      },
      departments: {
        enabled: ['fire', 'police'],
      },
      prechatForm: {
        label: {
          '*': 'prechatForm label',
        },
      },
      offlineForm: {
        label: {
          '*': 'offlineForm label',
        },
      },
      concierge: {
        avatarPath: 'http://example.com',
      },
      emailTranscriptEnabled: true,
    },
    color: {
      theme: '#555555',
    },
  }
  const result = selectors.getSettingsChatPopout(settings(mockSettings))
  const expected = {
    webWidget: {
      ...mockSettings,
      chat: {
        ..._.omit(mockSettings.chat, 'emailTranscriptEnabled'),
        menuOptions: {
          emailTranscript: true,
        },
      },
    },
  }

  expect(result).toEqual(expected)
})

describe('getSettingsChatDepartmentsEmpty', () => {
  it('returns true when it is an empty array', () => {
    const result = selectors.getSettingsChatDepartmentsEmpty(
      settings({
        chat: {
          departments: {
            enabled: [],
          },
        },
      })
    )

    expect(result).toEqual(true)
  })

  it('returns false when not an empty array', () => {
    const result = selectors.getSettingsChatDepartmentsEmpty(
      settings({
        chat: {
          departments: {
            enabled: [1, 2, 3],
          },
        },
      })
    )

    expect(result).toEqual(false)
  })

  it('returns false when not an array', () => {
    const result = selectors.getSettingsChatDepartmentsEmpty(
      settings({
        chat: {
          departments: {
            enabled: null,
          },
        },
      })
    )

    expect(result).toEqual(false)
  })

  describe('getSettingsHelpCenterFilter', () => {
    describe('when filters are set', () => {
      it('returns the filters', () => {
        const result = selectors.getSettingsHelpCenterFilter(
          settings({
            helpCenter: {
              sectionFilter: 'section',
              categoryFilter: 'category',
              labelFilter: 'label',
            },
          })
        )

        expect(result).toEqual({
          category: 'category',
          label_names: 'label',
          section: 'section',
        })
      })
    })

    describe('when filters are not set', () => {
      it('does not return filters', () => {
        const result = selectors.getSettingsHelpCenterFilter(
          settings({
            helpCenter: {
              sectionFilter: '',
              categoryFilter: null,
              labelFilter: undefined,
            },
          })
        )

        expect(result).toEqual({})
      })
    })
  })
})

test('getSettingsTalkTitle', () => {
  const title = { '*': 'cool title' }
  const result = selectors.getSettingsTalkTitle(talkSettings({ title }))

  expect(result).toEqual(title)
})

test('getSettingsTalkNickname', () => {
  const nickname = 'Support'
  const result = selectors.getSettingsTalkNickname(talkSettings({ nickname }))

  expect(result).toEqual(nickname)
})

test('getSettingsTalkSuppress', () => {
  const result = selectors.getSettingsTalkSuppress(talkSettings({ suppress: true }))

  expect(result).toEqual(true)
})

describe('contactOptions selectors', () => {
  const settings = contactOptionsSettings({
    enabled: true,
    contactFormLabel: { '*': 'form label' },
    contactButton: { '*': 'button' },
    chat: {
      chatLabelOnline: { '*': 'online label' },
      chatLabelOffline: { '*': 'offline label' },
    },
  })

  test('getSettingsContactOptionsEnabled', () => {
    expect(selectors.getSettingsContactOptionsEnabled(settings)).toEqual(true)
  })

  test('getSettingsContactOptionsContactFormLabel', () => {
    expect(selectors.getSettingsContactOptionsContactFormLabel(settings)).toEqual({
      '*': 'form label',
    })
  })

  test('getSettingsContactOptionsButton', () => {
    expect(selectors.getSettingsContactOptionsButton(settings)).toEqual({
      '*': 'button',
    })
  })

  test('getSettingsContactOptionsChatLabelOnline', () => {
    expect(selectors.getSettingsContactOptionsChatLabelOnline(settings)).toEqual({
      '*': 'online label',
    })
  })

  test('getSettingsContactOptionsChatLabelOffline', () => {
    expect(selectors.getSettingsContactOptionsChatLabelOffline(settings)).toEqual({
      '*': 'offline label',
    })
  })
})

test('getAnswerBotTitle', () => {
  const title = { '*': 'hello' }
  const result = selectors.getAnswerBotTitle(
    settings({
      answerBot: {
        title,
      },
    })
  )

  expect(result).toEqual(title)
})

test('getAnswerBotAvatarName', () => {
  const name = { '*': 'hello' }
  const result = selectors.getAnswerBotAvatarName(
    settings({
      answerBot: {
        avatar: {
          name,
        },
      },
    })
  )

  expect(result).toEqual(name)
})

test('getSettingsAnswerBotAvatarUrl', () => {
  const url = 'http://url'
  const result = selectors.getSettingsAnswerBotAvatarUrl(
    settings({
      answerBot: {
        avatar: {
          url,
        },
      },
    })
  )

  expect(result).toEqual(url)
})

test('getAnswerBotSearchLabels', () => {
  const result = selectors.getAnswerBotSearchLabels(
    settings({
      answerBot: {
        search: {
          labels: ['here', 'blah'],
        },
      },
    })
  )

  expect(result).toEqual(['here', 'blah'])
})

test('getSettingsAnswerBotSuppress', () => {
  const result = selectors.getSettingsAnswerBotSuppress(
    settings({
      answerBot: {
        suppress: true,
      },
    })
  )

  expect(result).toEqual(true)
})

test('getSettingsLauncherMobile', () => {
  const result = selectors.getSettingsLauncherMobile(
    settings({
      launcher: {
        mobile: {
          labelVisible: true,
        },
      },
    })
  )

  expect(result).toEqual({ labelVisible: true })
})
