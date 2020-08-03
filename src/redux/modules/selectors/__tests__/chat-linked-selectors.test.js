import * as selectors from '../chat-linked-selectors'
import * as chatReselectors from 'src/redux/modules/chat/chat-selectors/reselectors'
import * as globals from 'utility/globals'
import getModifiedState from 'src/fixtures/chat-reselectors-test-state'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'

describe('getShowMenu', () => {
  test('when values are correct', () => {
    jest.spyOn(globals, 'isPopout').mockReturnValue(false)
    const result = selectors.getShowMenu(getModifiedState())

    expect(result).toEqual(true)
    globals.isPopout.mockRestore()
  })

  describe('when a value is false', () => {
    test('when activeEmbed is not chat', () => {
      const result = selectors.getShowMenu(getModifiedState({ base: { activeEmbed: 'notChat' } }))

      expect(result).toEqual(false)
    })

    test('when chat screen is not CHATTING_SCREEN', () => {
      const result = selectors.getShowMenu(
        getModifiedState({ chat: { screen: 'ohLookThisIsIncorrect' } })
      )

      expect(result).toEqual(false)
    })

    test('when isPopout is true', () => {
      jest.spyOn(globals, 'isPopout').mockReturnValue(true)
      const result = selectors.getShowMenu(getModifiedState())

      expect(result).toEqual(false)
      globals.isPopout.mockRestore()
    })

    test('when chat screen is CHATTING_SCREEN and user is viewing offline page', () => {
      chatReselectors.getShowOfflineChat = jest.fn().mockReturnValue(true)
      const result = selectors.getShowMenu(getModifiedState({ chat: { screen: CHATTING_SCREEN } }))

      expect(result).toEqual(false)
    })

    test('when chat screen is CHATTING_SCREEN and user is not viewing offline page', () => {
      chatReselectors.getShowOfflineChat = jest.fn().mockReturnValue(false)
      const result = selectors.getShowMenu(getModifiedState({ chat: { screen: CHATTING_SCREEN } }))

      expect(result).toEqual(true)
    })
  })
})

test('getProfileConfig returns the expected value', () => {
  const result = selectors.getProfileConfig(getModifiedState())

  expect(result).toEqual({
    avatar: 'av',
    title: 'ti',
    rating: 'ra'
  })
})

describe('getChatAccountSettingsTitle', () => {
  test('returns the expected value when state is correct', () => {
    const result = selectors.getChatAccountSettingsTitle(getModifiedState())

    expect(result).toEqual('blorp')
  })

  test("returns i18n'd title when windowSettings title is undefined", () => {
    const result = selectors.getChatAccountSettingsTitle(
      getModifiedState({
        chat: { accountSettings: { chatWindow: { title: null } } }
      })
    )

    expect(result).toEqual('Chat with us')
  })
})

describe('getChatTitle', () => {
  test('returns i18n of settings Chat Title when translations are included', () => {
    const result = selectors.getChatTitle(getModifiedState())

    expect(result).toEqual('Hello World')
  })

  test('returns Account Settings Title when translation is not included', () => {
    const result = selectors.getChatTitle(
      getModifiedState({
        settings: { chat: { title: null } }
      })
    )

    expect(result).toEqual('blorp')
  })
})

describe('getLauncherBadgeSettings aggregates badge and label settings', () => {
  test('when label is correctly set', () => {
    const result = selectors.getLauncherBadgeSettings(getModifiedState())

    expect(result).toEqual({
      enabled: true,
      text: 'badgeText',
      image: 'heyLookA.img',
      label: 'badgeLabel',
      layout: 'left, no right... The other left?'
    })
  })

  test('when label is incorrectly set, use badgeText', () => {
    const result = selectors.getLauncherBadgeSettings(
      getModifiedState({
        settings: {
          launcher: { badge: { label: 'ThisIsTheIncorrectStructure ' } }
        }
      })
    )

    expect(result).toEqual({
      enabled: true,
      text: 'badgeText',
      image: 'heyLookA.img',
      label: 'badgeText',
      layout: 'left, no right... The other left?'
    })
  })

  test('pulls settings out of config', () => {
    const state = getModifiedState({
      chat: {
        config: {
          badge: {
            enabled: true,
            text: 'new text',
            imagePath: 'a.jpg',
            layout: 'new layout'
          }
        }
      }
    })
    state.chat.accountSettings.banner = {}
    state.settings.launcher.badge = {}
    const result = selectors.getLauncherBadgeSettings(state)
    expect(result).toMatchObject({
      enabled: true,
      image: 'a.jpg',
      layout: 'new layout',
      label: 'new text'
    })
  })

  describe('both account settings and config are present', () => {
    it('uses account settings first', () => {
      const state = getModifiedState({
        chat: {
          config: {
            badge: {
              enabled: true,
              text: 'new text',
              imagePath: 'a.jpg',
              layout: 'new layout'
            }
          }
        }
      })
      const result = selectors.getLauncherBadgeSettings(state)
      expect(result).toEqual({
        enabled: true,
        text: 'badgeText',
        image: 'heyLookA.img',
        label: 'badgeLabel',
        layout: 'left, no right... The other left?'
      })
    })

    it('uses config when account settings is disabled', () => {
      const state = getModifiedState({
        chat: {
          config: {
            badge: {
              enabled: true,
              text: 'new text',
              imagePath: 'a.jpg',
              layout: 'new layout'
            }
          }
        }
      })
      state.chat.accountSettings.banner.enabled = false
      state.settings.launcher.badge = {}
      const result = selectors.getLauncherBadgeSettings(state)
      expect(result).toMatchObject({
        enabled: true,
        image: 'a.jpg',
        layout: 'new layout',
        label: 'new text'
      })
    })
  })
})

describe('getConciergeSettings', () => {
  test('overrides chat state with settings', () => {
    const result = selectors.getConciergeSettings(getModifiedState())

    expect(result).toEqual({
      avatar_path: 'overrideAvatarPath',
      display_name: 'overrideName',
      title: 'overrideTitle'
    })
  })

  test('when no overrides present, use chat state', () => {
    const result = selectors.getConciergeSettings(
      getModifiedState({
        settings: {
          chat: {
            concierge: null
          }
        }
      })
    )

    expect(result).toEqual({
      avatar_path: 'regularAvatarPath',
      display_name: 'regularName',
      title: { '*': 'regularTitle' }
    })
  })
})

describe('getOfflineFormSettings', () => {
  test('when accountSettings is set and greeting is also set', () => {
    const result = selectors.getOfflineFormSettings(getModifiedState())

    expect(result).toEqual({
      enabled: true,
      boop: 'boop2',
      message: 'hello fren',
      form: {
        0: { name: 'name', required: true },
        2: { name: 'phone', label: 'Phone Number', required: true },
        3: { name: 'message', label: 'Message', required: false }
      }
    })
  })

  describe('when accountSettings set and greeting is not set', () => {
    test('returns the chat message', () => {
      const result = selectors.getOfflineFormSettings(
        getModifiedState({
          settings: { chat: { offlineForm: null } }
        })
      )

      expect(result).toEqual({
        enabled: true,
        boop: 'boop2',
        message: 'huh...',
        form: {
          0: { name: 'name', required: true },
          2: { name: 'phone', label: 'Phone Number', required: true },
          3: { name: 'message', label: 'Message', required: false }
        }
      })
    })
  })

  describe('when neither the greeting or message is set', () => {
    test('returns the chat message', () => {
      const result = selectors.getOfflineFormSettings(
        getModifiedState({
          settings: {
            chat: {
              offlineForm: null
            }
          },
          chat: {
            accountSettings: {
              offlineForm: null
            }
          }
        })
      )

      expect(result).toEqual({
        message: "Sorry, we aren't online at the moment. Leave a message and we'll get back to you."
      })
    })
  })
})

describe('getPrechatFormSettings', () => {
  it('returns the expected values', () => {
    const result = selectors.getPrechatFormSettings(getModifiedState())

    expect(result).toEqual({
      greeting: 'accPrechatGreeting',
      departmentLabel: 'accPrechatDeptLabel',
      required: 'burp',
      message: 'accPrechatMessage'
    })
  })

  it('returns override translations in settings', () => {
    const result = selectors.getPrechatFormSettings(
      getModifiedState({
        settings: {
          chat: {
            prechatForm: {
              departmentLabel: {
                '*': 'prechatTranslatedDeptLabel'
              },
              greeting: {
                '*': 'prechatTranslatedGreeting'
              }
            }
          }
        }
      })
    )

    expect(result).toEqual({
      required: 'burp',
      message: 'prechatTranslatedGreeting',
      departmentLabel: 'prechatTranslatedDeptLabel',
      greeting: 'accPrechatGreeting'
    })
  })
})

describe('getEnabledDepartments', () => {
  describe('with enabled departments are listed', () => {
    it('returns only enabled departments', () => {
      const result = selectors.getEnabledDepartments(getModifiedState())

      expect(result).toEqual([{ id: 111, name: 'burgers' }, { id: 222, name: 'pizza' }])
    })
  })

  describe('when enabled is an empty array', () => {
    it('returns no department', () => {
      const modifiedState = getModifiedState({})

      modifiedState.settings.chat.departments.enabled = []
      const result = selectors.getEnabledDepartments(modifiedState)

      expect(result).toEqual([])
    })
  })

  describe('when a department is not enabled, but it is the default', () => {
    it('does not return it', () => {
      const modifiedState = getModifiedState({})

      modifiedState.settings.chat.departments.enabled = []
      modifiedState.chat.defaultDepartment.id = 333

      const result = selectors.getEnabledDepartments(modifiedState)

      expect(result).toEqual([])
    })
  })

  describe('when enabled is not an array', () => {
    it('returns all departments', () => {
      const result = selectors.getEnabledDepartments(
        getModifiedState({
          settings: { chat: { departments: { enabled: null } } }
        })
      )

      expect(result).toEqual([
        { id: 111, name: 'burgers' },
        { id: 222, name: 'pizza' },
        { id: 333, name: 'thickshakes' }
      ])
    })
  })
})

describe('getDefaultSelectedDepartment', () => {
  describe('when the selected default department is not enabled', () => {
    it('returns the department', () => {
      const result = selectors.getDefaultSelectedDepartment(
        getModifiedState({ chat: { defaultDepartment: { id: 333 } } })
      )

      expect(result).toEqual({ id: 333, name: 'thickshakes' })
    })
  })

  it('in accountSettings, return that department if settings is not set', () => {
    const result = selectors.getDefaultSelectedDepartment(
      getModifiedState({
        chat: { defaultDepartment: { id: 111 } }
      })
    )

    expect(result).toEqual({ id: 111, name: 'burgers' })
  })

  it('ID in settings, override the chat dept', () => {
    const result = selectors.getDefaultSelectedDepartment(
      getModifiedState({
        settings: { chat: { departments: { select: 111 } } },
        chat: { defaultDepartment: { id: 222 } }
      })
    )

    expect(result).toEqual({
      id: 111,
      name: 'burgers'
    })
  })

  it('name in settings, return that department', () => {
    const result = selectors.getDefaultSelectedDepartment(
      getModifiedState({
        settings: { chat: { departments: { select: 'burgers' } } },
        chat: { defaultDepartment: { id: 222 } }
      })
    )

    expect(result).toEqual({
      id: 111,
      name: 'burgers'
    })
  })
})

describe('getCurrentConcierges', () => {
  test('when values are correct', () => {
    const result = selectors.getCurrentConcierges(
      getModifiedState({
        chat: { activeAgents: new Map([]) }
      })
    )

    expect(result).toEqual([
      {
        avatar_path: 'overrideAvatarPath',
        display_name: 'overrideName',
        title: 'overrideTitle'
      }
    ])
  })

  test('when there are no agents, return default concierge settings', () => {
    const result = selectors.getCurrentConcierges(
      getModifiedState({
        chat: {
          activeAgents: new Map([])
        }
      })
    )

    expect(result).toEqual([
      {
        avatar_path: 'overrideAvatarPath',
        display_name: 'overrideName',
        title: 'overrideTitle'
      }
    ])
  })

  test('when there are no agents and no override concierge settings, returns regular concierge', () => {
    const result = selectors.getCurrentConcierges(
      getModifiedState({
        chat: {
          activeAgents: new Map([])
        },
        settings: {
          chat: {
            concierge: null
          }
        }
      })
    )

    expect(result).toEqual([
      {
        avatar_path: 'regularAvatarPath',
        display_name: 'regularName',
        title: {
          '*': 'regularTitle'
        }
      }
    ])
  })
})

describe('getOfflineFormFields', () => {
  test('returns our predefined offline form fields', () => {
    const result = selectors.getOfflineFormFields(getModifiedState())

    expect(result).toEqual({
      message: { label: 'Message', required: false, name: 'message' },
      name: { required: true, name: 'name' },
      phone: { label: 'Phone Number', required: true, name: 'phone' }
    })
  })
})

describe('getChatNotification', () => {
  it('returns mcbob by default', () => {
    const result = selectors.getChatNotification(getModifiedState())

    expect(result).toEqual({
      avatar_path: 'bobPath',
      nick: 'agent:mcbob'
    })
  })

  test('returns the concierge avatar_path if agent has no avatar_path', () => {
    const result = selectors.getChatNotification(
      getModifiedState({
        chat: { notification: { nick: 'agent:trigger' } }
      })
    )

    expect(result).toEqual({
      avatar_path: 'overrideAvatarPath',
      nick: 'agent:trigger'
    })
  })
})

describe('isInChattingScreen', () => {
  test('when values are correct', () => {
    const result = selectors.isInChattingScreen(getModifiedState())

    expect(result).toEqual(true)
  })

  test('when widget has not been shown', () => {
    const result = selectors.isInChattingScreen(
      getModifiedState({
        base: {
          widgetShown: false
        }
      })
    )

    expect(result).toEqual(false)
  })

  test('screen is not CHATTING_SCREEN', () => {
    const result = selectors.isInChattingScreen(
      getModifiedState({
        chat: {
          screen: 'notChattingScreen'
        }
      })
    )

    expect(result).toEqual(false)
  })

  test('activeEmbed is not chat', () => {
    const result = selectors.isInChattingScreen(
      getModifiedState({
        base: {
          activeEmbed: 'notChat'
        }
      })
    )

    expect(result).toEqual(false)
  })
})

describe('getChatHistoryLabel', () => {
  it('returns the expected string', () => {
    const result = selectors.getChatHistoryLabel(getModifiedState())

    expect(result).toEqual('View past chats')
  })
})

describe('getIsPopoutButtonVisible', () => {
  test('when values are correct', () => {
    jest.spyOn(globals, 'isPopout').mockReturnValue(false)

    const result = selectors.getIsPopoutButtonVisible(getModifiedState())

    expect(result).toEqual(true)
  })

  describe('when values are incorrect', () => {
    test('when getIsPopoutAvailable returns false', () => {
      const result = selectors.getIsPopoutButtonVisible(
        getModifiedState({ chat: { isAuthenticated: true } })
      )
      expect(result).toEqual(false)
    })

    test('when activeEmbed is not chat', () => {
      jest.spyOn(globals, 'isPopout').mockReturnValue(false)
      const result = selectors.getIsPopoutButtonVisible(
        getModifiedState({ base: { activeEmbed: 'notChat' } })
      )
      expect(result).toEqual(false)
      globals.isPopout.mockRestore()
    })

    test('when popout button is not enabled in settings', () => {
      const result = selectors.getIsPopoutButtonVisible(
        getModifiedState({
          settings: { navigation: { popoutButton: { enabled: false } } }
        })
      )
      expect(result).toEqual(false)
    })
  })
})

describe('getOfflineFormEnabled', () => {
  test('returns true when offline form is enabled via account settings', () => {
    const result = selectors.getOfflineFormEnabled(getModifiedState())
    expect(result).toEqual(true)
  })

  test('returns false when offline form is not enabled', () => {
    const result = selectors.getOfflineFormEnabled(
      getModifiedState({
        chat: {
          accountSettings: {
            offlineForm: {
              enabled: false
            }
          }
        }
      })
    )
    expect(result).toEqual(false)
  })

  test('returns true when offline form is enabled via config', () => {
    const result = selectors.getOfflineFormEnabled(
      getModifiedState({
        chat: {
          accountSettings: {
            offlineForm: {
              enabled: false
            }
          },
          config: {
            forms: {
              offlineEnabled: true
            }
          }
        }
      })
    )
    expect(result).toEqual(true)
  })

  test('returns false when no settings are enabled', () => {
    const result = selectors.getOfflineFormEnabled(
      getModifiedState({
        chat: {
          accountSettings: {
            offlineForm: {
              enabled: false
            }
          },
          config: {
            forms: {}
          }
        }
      })
    )
    expect(result).toEqual(false)
  })
})

describe('getPrechatFormFields', () => {
  describe('with departments enabled', () => {
    const select = () => {
      const stateOverride = {
        chat: {
          department: [
            { id: 222, name: 'Pizza' },
            { id: 111, name: 'burgers' },
            { id: 333, name: 'thickshakes' }
          ]
        },
        settings: {
          chat: {
            departments: {
              enabled: ['burgers', 222],
              select: 'burgers'
            }
          }
        }
      }

      return selectors.getPrechatFormFields(getModifiedState(stateOverride))
    }

    it('returns the expected fields', () => {
      expect(select()).toEqual({
        department: { label: 'Choose a department' },
        departments: [
          { id: 111, isDefault: true, name: 'burgers', value: 111 },
          { id: 222, isDefault: false, name: 'pizza', value: 222 }
        ]
      })
    })
  })

  describe('with no departments enabled', () => {
    const select = () => {
      const modifiedState = getModifiedState()
      modifiedState.settings.chat.departments.enabled = []

      return selectors.getPrechatFormFields(modifiedState)
    }

    it('returns the expected fields', () => {
      expect(select()).toEqual({
        department: { label: 'Choose a department' },
        departments: []
      })
    })
  })
})

describe('getDelayChatConnectionEnabled', () => {
  test.each([
    [false, false, true, false],
    [false, false, false, true],
    [false, true, true, true],
    [false, true, false, true],
    [true, true, false, true],
    [true, false, false, true],
    [true, false, true, true],
    [true, true, true, true]
  ])(
    'when defaultToChatWidgetLite == %p, connectOnDemand == %p, connectOnPageLoad == %p, it returns %p',
    (defaultToChatWidgetLite, connectOnDemand, connectOnPageLoad, expectedValue) => {
      const result = selectors.getDelayChatConnectionEnabled.resultFunc(
        defaultToChatWidgetLite,
        connectOnDemand,
        connectOnPageLoad
      )

      expect(result).toEqual(expectedValue)
    }
  )
})

describe('getDelayChatConnection', () => {
  test.each([
    [true, false, '', true],
    [false, false, '', false],
    [true, true, '', false],
    [true, false, 'connecting', false]
  ])(
    'when delayChatConnectionEnabled == %p, is chatting == %p, chatConnection == %p, it returns %p',
    (delayChatConnectionEnabled, isChatting, connection, expectedValue) => {
      const result = selectors.getDelayChatConnection.resultFunc(
        delayChatConnectionEnabled,
        isChatting,
        connection
      )

      expect(result).toEqual(expectedValue)
    }
  )
})

describe('getShowRatingButtons', () => {
  test.each([
    ['when all values are true', true, true, true, CHATTING_SCREEN, true],
    ['when profileConfig.rating is false', false, true, true, CHATTING_SCREEN, false],
    ['when agentCount is > 0', true, false, true, CHATTING_SCREEN, false],
    ['when isChatting is false', true, true, false, CHATTING_SCREEN, false],
    ['when its not on chatting screen', true, true, true, 'not_CHATTING_SCREEN', false]
  ])('%p', (_title, profileConfigRating, agentJoined, isChatting, screen, expectedValue) => {
    const result = selectors.getShowRatingButtons.resultFunc(
      { rating: profileConfigRating },
      agentJoined,
      isChatting,
      screen
    )

    expect(result).toEqual(expectedValue)
  })
})
