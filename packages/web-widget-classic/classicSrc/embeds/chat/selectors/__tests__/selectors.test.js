import { getDeferredChatApi } from 'classicSrc/embeds/chat/selectors'
import * as selectors from 'classicSrc/embeds/chat/selectors/selectors'
import {
  getHasBackfillCompleted,
  getIsEndChatModalVisible,
  getChatOnline,
} from 'classicSrc/embeds/chat/selectors/selectors'
import testState from 'classicSrc/fixtures/chat-selectors-test-state'
import _ from 'lodash'

test('getChats', () => {
  const result = selectors.getChats(testState)

  expect(result).toEqual(
    new Map([
      [1, { timestamp: 1 }],
      [2, { timestamp: 2 }],
    ])
  )
})

test('isAgent', () => {
  const nonAgentResult = selectors.isAgent('Neo')
  const agentResult = selectors.isAgent('agent:Smith')

  expect(nonAgentResult).toEqual(false)
  expect(agentResult).toEqual(true)
})

test('getThemeMessageType', () => {
  const result = selectors.getThemeMessageType(testState)

  expect(result).toEqual('HelloMyNameIsTaipan')
})

test('getOrderedAgents', () => {
  const result = selectors.getOrderedAgents(testState)

  expect(result).toEqual(['Bob', 'Charlie', 'Groundskeeper Willie'])
})

test('getShowOperatingHours', () => {
  const result = selectors.getShowOperatingHours(testState)

  expect(result).toEqual('foo')
})

test('getForcedStatus', () => {
  const result = selectors.getForcedStatus(testState)

  expect(result).toEqual('Caaarrrrrrrrllll, that kills people')
})

test('getInactiveAgents', () => {
  const result = selectors.getInactiveAgents(testState)

  expect(result).toEqual('Lois Lane')
})

test('getSocialLogin', () => {
  const result = selectors.getSocialLogin(testState)

  expect(result).toEqual(54321)
})

test('getConnection', () => {
  const result = selectors.getConnection(testState)

  expect(result).toEqual('emotional')
})

test('getCurrentMessage', () => {
  const result = selectors.getCurrentMessage(testState)

  expect(result).toEqual("I can't let you do that, Dave")
})

test('getChatRating', () => {
  const result = selectors.getChatRating(testState)

  expect(result).toEqual(9001)
})

test('getChatRating', () => {
  const result = selectors.getChatScreen(testState)

  expect(result).toEqual('blue')
})

test('getChatStatus', () => {
  const result = selectors.getChatStatus(testState)

  expect(result).toEqual('online')
})

test('getChatVisitor', () => {
  const result = selectors.getChatVisitor(testState)

  expect(result).toEqual('Kerrigan')
})

test('getIsChatting', () => {
  const result = selectors.getIsChatting(testState)

  expect(result).toEqual(true)
})

test('getCanShowOnlineChat', () => {
  const result = selectors.getCanShowOnlineChat(testState)

  expect(result).toEqual(true)
})

test('getNotificationCount', () => {
  const result = selectors.getNotificationCount(testState)

  expect(result).toEqual(321)
})

test('getEmailTranscript', () => {
  const result = selectors.getEmailTranscript(testState)

  expect(result).toEqual('Vodka is pretty overrated')
})

test('getAttachmentsEnabled', () => {
  const result = selectors.getAttachmentsEnabled(testState)

  expect(result).toEqual('maybe')
})

test('getRatingSettings', () => {
  const result = selectors.getRatingSettings(testState)

  expect(result).toEqual('Hawaii Five-Oh')
})

test('getQueuePosition', () => {
  const result = selectors.getQueuePosition(testState)

  expect(result).toEqual(1000)
})

test('getReadOnlyState', () => {
  const result = selectors.getReadOnlyState(testState)

  expect(result).toEqual('sure thing')
})

test('getChatOfflineForm', () => {
  const result = selectors.getChatOfflineForm(testState)

  expect(result).toEqual({ hello: 'charlie' })
})

test('getOfflineMessage', () => {
  const result = selectors.getOfflineMessage(testState)

  expect(result).toEqual('Oops, offline!')
})

test('getPreChatFormState', () => {
  const result = selectors.getPreChatFormState(testState)

  expect(result).toEqual({ charlie: 'say hello back!' })
})

test('getAgentJoined', () => {
  const result = selectors.getAgentJoined(testState)

  expect(result).toEqual('Sam I am')
})

test('getLastReadTimestamp', () => {
  const result = selectors.getLastReadTimestamp(testState)

  expect(result).toEqual('Doomsday')
})

test('getOperatingHours', () => {
  const result = selectors.getOperatingHours(testState)

  expect(result).toEqual('25/8')
})

test('getLoginSettings', () => {
  const result = selectors.getLoginSettings(testState)

  expect(result).toEqual('unsafePassword')
})

test('getStandaloneMobileNotificationVisible', () => {
  const result = selectors.getStandaloneMobileNotificationVisible(testState)

  expect(result).toEqual('this is a really long var name')
})

test('getIsAuthenticated', () => {
  const result = selectors.getIsAuthenticated(testState)

  expect(result).toEqual('nope')
})

test('getZChatVendor', () => {
  const result = selectors.getZChatVendor(testState)

  expect(result).toEqual('mmm... legacy')
})

test('getSliderVendor', () => {
  const result = selectors.getSliderVendor(testState)

  expect(result).toEqual('wheeeeeee')
})

test('getWindowSettings', () => {
  const result = selectors.getWindowSettings(testState)

  expect(result).toEqual({ x: 'y' })
})

test('getThemeColor', () => {
  const result = selectors.getThemeColor(testState)

  expect(result).toEqual({
    base: 'green',
    text: undefined,
  })
})

test('getBadgeColor', () => {
  const result = selectors.getBadgeColor(testState)

  expect(result).toEqual('wait, no, blue!')
})

test('getChatAccountSettingsConcierge', () => {
  const result = selectors.getChatAccountSettingsConcierge(testState)

  expect(result).toEqual({ yes: 'madame' })
})

test('getChatAccountSettingsOfflineForm', () => {
  const result = selectors.getChatAccountSettingsOfflineForm(testState)

  expect(result).toEqual({ ohNo: "We're down!" })
})

test('getChatAccountSettingsPrechatForm', () => {
  const result = selectors.getChatAccountSettingsPrechatForm(testState)

  expect(result).toEqual({ Ive: 'been waiting for this' })
})

test('getDepartments', () => {
  const result = selectors.getDepartments(testState)

  expect(result).toEqual({
    one: 'blah',
    two: 'heh',
    three: 'oh',
  })
})

test('getAccountSettingsLauncherBadge', () => {
  const result = selectors.getAccountSettingsLauncherBadge(testState)

  expect(result).toEqual({
    helloThere: 'GENERAL KENOBI!',
    enabled: true,
  })
})

test('getEmbeddableConfigBadgeSettings', () => {
  const result = selectors.getEmbeddableConfigBadgeSettings(testState)

  expect(result).toEqual({
    image: 'blahmage',
    text: 'blahtext',
    enabled: true,
  })
})

describe('getChatBadgeEnabled', () => {
  test('when account settings and config are enabled', () => {
    const result = selectors.getChatBadgeEnabled(testState)

    expect(result).toBe(true)
  })

  test('when only account settings is enabled', () => {
    const state = _.cloneDeep(testState)
    state.chat.config.badge.enabled = false
    const result = selectors.getChatBadgeEnabled(state)

    expect(result).toBe(true)
  })

  test('when only config is enabled', () => {
    const state = _.cloneDeep(testState)
    state.chat.accountSettings.banner.enabled = false
    const result = selectors.getChatBadgeEnabled(state)

    expect(result).toBe(true)
  })

  test('when account settings and config are disabled', () => {
    const state = _.cloneDeep(testState)
    state.chat.config.badge.enabled = false
    state.chat.accountSettings.banner.enabled = false
    const result = selectors.getChatBadgeEnabled(state)

    expect(result).toBe(false)
  })
})

test('getHideBranding', () => {
  const result = selectors.getHideBranding(testState)

  expect(result).toEqual(true)
})

test('getAccountDefaultDepartmentId', () => {
  const result = selectors.getAccountDefaultDepartmentId(testState)

  expect(result).toEqual(123456)
})

test('getDepartmentList', () => {
  const result = selectors.getDepartmentsList(testState)

  expect(result).toEqual(['blah', 'heh', 'oh'])
})

test('getIsLoggingOut', () => {
  const result = selectors.getIsLoggingOut(testState)

  expect(result).toEqual('eh')
})

test('getFirstMessageTimestamp', () => {
  const result = selectors.getFirstMessageTimestamp(testState)

  expect(result).toEqual(1)
})

test('getShowChatHistory', () => {
  const result = selectors.getShowChatHistory(testState)

  expect(result).toEqual('Im not sure')
})

test('getFirstMessageTimestamp when map is invalid', () => {
  const invalidState = {
    chat: {
      chats: new Map([[undefined], [undefined]]),
    },
  }

  jest.spyOn(Date, 'now').mockReturnValue('blarp')

  const result = selectors.getFirstMessageTimestamp(invalidState)

  expect(result).toEqual('blarp')
  Date.now.mockRestore()
})

describe('getHasBackfillCompleted', () => {
  it('returns true when the backfill has completed', () => {
    expect(getHasBackfillCompleted({ chat: { chatLogBackfillCompleted: true } })).toBe(true)
  })

  it('returns false when the backfill has not completed', () => {
    expect(getHasBackfillCompleted({ chat: { chatLogBackfillCompleted: false } })).toBe(false)
  })
})

describe('getIsEndChatModalVisible', () => {
  it('returns true when the end chat modal is visible', () => {
    expect(getIsEndChatModalVisible({ chat: { endChatModalVisible: true } })).toBe(true)
  })

  it('returns false when the end chat modal is not visible', () => {
    expect(getIsEndChatModalVisible({ chat: { endChatModalVisible: true } })).toBe(true)
  })
})

describe('getChatOnline', () => {
  it('returns true when chat is forced to be online', () => {
    expect(
      getChatOnline({
        chat: {
          forcedStatus: 'online',
        },
      })
    ).toBe(true)
  })

  it('returns false when chat is forced to be offline', () => {
    expect(
      getChatOnline({
        chat: {
          forcedStatus: 'offline',
        },
      })
    ).toBe(false)
  })

  describe('when an agent is online', () => {
    const createState = ({ status, filter, departments, isDepartmentVisibleFeatureEnabled }) => ({
      base: {
        embeddableConfig: {
          embeds: {
            chat: {
              props: {
                webWidgetPrechatFormVisibleDepartments: isDepartmentVisibleFeatureEnabled,
              },
            },
          },
        },
      },
      chat: {
        account_status: status,
        departments,
      },
      settings: {
        chat: {
          departments: {
            enabled: filter,
          },
        },
      },
    })

    it('returns true when the status is online', () => {
      expect(
        getChatOnline(
          createState({
            status: 'online',
          })
        )
      ).toBe(true)
    })

    it('returns true when the status is away', () => {
      expect(
        getChatOnline(
          createState({
            status: 'away',
          })
        )
      ).toBe(true)
    })

    describe('when arturo web_widget_prechat_form_visible_departments is enabled', () => {
      it('returns true when no departments have been filtered', () => {
        expect(
          getChatOnline(
            createState({
              status: 'online',
              isDepartmentVisibleFeatureEnabled: true,
              filter: undefined,
            })
          )
        ).toBe(true)
      })

      it('returns true when all departments have been filtered', () => {
        expect(
          getChatOnline(
            createState({
              status: 'online',
              isDepartmentVisibleFeatureEnabled: true,
              filter: [],
            })
          )
        ).toBe(true)
      })

      it('returns true when at least one filtered department is online', () => {
        expect(
          getChatOnline(
            createState({
              status: 'online',
              isDepartmentVisibleFeatureEnabled: true,
              filter: ['Something'],
              departments: {
                1: {
                  id: 1,
                  name: 'Something',
                  status: 'online',
                },
              },
            })
          )
        ).toBe(true)
      })

      it('returns false when no departments that have been filtered are online', () => {
        expect(
          getChatOnline(
            createState({
              status: 'online',
              isDepartmentVisibleFeatureEnabled: true,
              filter: ['Something'],
              departments: {
                1: {
                  id: 1,
                  name: 'Something',
                  status: 'offline',
                },
              },
            })
          )
        ).toBe(false)
      })
    })
  })

  it('returns false if an agent is not online or away', () => {
    expect(
      getChatOnline({
        chat: {
          account_status: 'offline',
        },
      })
    ).toBe(false)
  })
})

describe('getDeferredChatApi', () => {
  const createState = (mediatorHost, zopimId) => ({
    base: {
      embeddableConfig: {
        embeds: {
          chat: {
            props: {
              mediatorHost,
              zopimId,
            },
          },
        },
      },
    },
  })

  it('returns null when mediatorHost does not exist in config', () => {
    expect(getDeferredChatApi(createState(undefined, 'someId'))).toBeNull()
  })

  it('returns null when zopimId does not exist', () => {
    expect(getDeferredChatApi(createState('example.com', undefined))).toBeNull()
  })

  it('returns the url to get deferred chat status', () => {
    expect(getDeferredChatApi(createState('example.com', 'someId'))).toBe(
      `https://example.com/client/widget/account/status?embed_key=someId`
    )
  })
})

test('getEmbeddableConfigOfflineEnabled', () => {
  const result = selectors.getEmbeddableConfigOfflineEnabled(testState)
  expect(result).toEqual(true)
})
