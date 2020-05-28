import _ from 'lodash'
import zopimApi from '..'
import * as chatActions from 'src/redux/modules/chat'
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors'
import * as chatLinkedSelectors from 'src/redux/modules/selectors/chat-linked-selectors'
import * as baseSelectors from 'src/redux/modules/base/base-selectors'
import * as baseActions from 'src/redux/modules/base'
import * as apis from 'src/service/api/apis'

import tracker from 'service/tracker'
import { settings } from 'service/settings'

jest.mock('src/service/api/apis')
jest.mock('src/redux/modules/chat', () => ({
  setStatusForcefully: jest.fn(),
  setVisitorInfo: jest.fn()
}))
jest.mock('src/redux/modules/chat/chat-selectors')
jest.mock('src/redux/modules/base/base-selectors')
jest.mock('src/redux/modules/selectors/chat-linked-selectors')
jest.mock('src/redux/modules/base', () => ({
  badgeHideReceived: jest.fn(),
  badgeShowReceived: jest.fn(),
  updateActiveEmbed: jest.fn()
}))
jest.mock('service/i18n', () => ({
  i18n: {
    setCustomTranslations: jest.fn()
  }
}))
jest.mock('service/tracker')

// Assume chat has been initialized and connected when testing zopim api methods.
zopimApi.handleChatSDKInitialized()
zopimApi.handleChatConnected()

const mockStore = {
  dispatch: jest.fn(),
  getState: jest.fn()
}

describe('handleZopimQueue', () => {
  describe('queue was set up by web widget', () => {
    describe('if it is a function', () => {
      it('calls queue item ', () => {
        const methodSpy = jest.fn()
        const win = {
          $zopim: {
            _: [methodSpy],
            _setByWW: true
          }
        }

        zopimApi.handleZopimQueue(win)

        expect(methodSpy).toHaveBeenCalled()
      })
    })

    describe('if it is not a function', () => {
      /* eslint-disable no-console */
      const win = {
        $zopim: {
          _: [undefined],
          _setByWW: true
        }
      }

      beforeEach(() => {
        jest.spyOn(console, 'error')
        console.error.mockReturnValue()
        zopimApi.handleZopimQueue(win)
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      it('logs the error', () => {
        expect(console.error).toHaveBeenCalledWith(
          expect.stringMatching(
            /An error occurred within your use of the \$zopim Widget API:\s+undefined/
          )
        )
      })
      /* eslint-disable no-console */
    })
  })

  describe('queue was not set up by web widget', () => {
    it('does call queue item', () => {
      const methodSpy = jest.fn()
      const win = {
        $zopim: {
          _: [methodSpy],
          _setByWW: false
        }
      }

      zopimApi.handleZopimQueue(win)

      expect(methodSpy).not.toHaveBeenCalled()
    })
  })
})

describe('setupZopimQueue', () => {
  describe('when $zopim has not been defined on the window', () => {
    const mockWin = {}

    beforeEach(() => {
      zopimApi.setupZopimQueue(mockWin)
    })

    describe('creates a zopim global function with', () => {
      it('a queue', () => {
        expect(mockWin.$zopim._).toEqual([])
      })

      it('a set function', () => {
        expect(mockWin.$zopim.set).toEqual(expect.any(Function))
      })

      it('a set function queue', () => {
        expect(mockWin.$zopim.set._).toEqual([])
      })

      it('a set by web widget flag', () => {
        expect(mockWin.$zopim._setByWW).toEqual(true)
      })
    })

    describe('when the $zopim global function is called', () => {
      beforeEach(() => {
        mockWin.$zopim('mockApiCall')
      })

      it('queues the call', () => {
        expect(mockWin.$zopim._).toContain('mockApiCall')
      })
    })
  })
})

describe('setUpZopimApiMethods', () => {
  let mockWin

  beforeEach(() => {
    mockWin = {}
    zopimApi.setUpZopimApiMethods(mockWin, mockStore)
  })

  test('authenticate', () => {
    const jwtFnSpy = jest.fn()

    mockWin.$zopim.livechat.authenticate({
      jwtFn: jwtFnSpy
    })

    expect(settings.get('authenticate.chat.jwtFn')).toEqual(jwtFnSpy)
  })

  describe('window', () => {
    test('toggle method', () => {
      mockWin.$zopim.livechat.window.toggle()

      expect(apis.toggleApi).toHaveBeenCalled()
    })

    test('hide method', () => {
      mockWin.$zopim.livechat.window.hide()

      expect(apis.hideApi).toHaveBeenCalled()
    })

    describe('show method', () => {
      let getCanShowOnlineChatMock

      beforeEach(() => {
        getCanShowOnlineChatMock = jest.spyOn(chatSelectors, 'getCanShowOnlineChat')

        mockWin.$zopim.livechat.window.show()
      })

      describe('when chat is online or there is an active chat session', () => {
        beforeEach(() => {
          getCanShowOnlineChatMock.mockReturnValue(true)
        })

        it('calls the openApi method', () => {
          expect(apis.openApi).toHaveBeenCalled()
        })
        it('calls the showApi method', () => {
          expect(apis.showApi).toHaveBeenCalled()
        })
        it('updates the active embed', () => {
          expect(baseActions.updateActiveEmbed).toHaveBeenCalledWith('chat')
        })
      })

      describe('when chat is offline and there is not an active chat session', () => {
        beforeEach(() => {
          getCanShowOnlineChatMock.mockReturnValue(false)
        })

        it('calls the openApi method', () => {
          expect(apis.openApi).toHaveBeenCalled()
        })
        it('calls the showApi method', () => {
          expect(apis.showApi).toHaveBeenCalled()
        })
        it('does not update the active embed', () => {
          expect(baseActions.updateActiveEmbed).not.toHaveBeenCalled()
        })
      })

      describe('when chat connection is delayed', () => {
        beforeEach(() => {
          jest.spyOn(chatLinkedSelectors, 'getDelayChatConnection').mockReturnValue(true)
        })

        it('calls the openApi method', () => {
          expect(apis.openApi).toHaveBeenCalled()
        })

        it('calls the showApi method', () => {
          expect(apis.showApi).toHaveBeenCalled()
        })

        it('calls updateActiveEmbed with chat', () => {
          expect(baseActions.updateActiveEmbed).toHaveBeenCalledWith('chat')
        })
      })
    })

    describe('getDisplay method', () => {
      it('returns true when the widget is visibile', () => {
        jest.spyOn(baseSelectors, 'getWebWidgetVisible').mockReturnValue(true)

        const result = mockWin.$zopim.livechat.window.getDisplay()

        expect(result).toEqual(true)
      })

      it('returns false when the widget not visibile', () => {
        jest.spyOn(baseSelectors, 'getWebWidgetVisible').mockReturnValue(false)

        const result = mockWin.$zopim.livechat.window.getDisplay()

        expect(result).toEqual(false)
      })
    })

    test('setTitle', () => {
      const title = 'title'

      mockWin.$zopim.livechat.window.setTitle(title)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          chat: {
            title: {
              '*': title
            }
          }
        }
      })
    })

    test('setOffsetVertical', () => {
      const vertical = 10

      mockWin.$zopim.livechat.window.setOffsetVertical(vertical)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          offset: {
            vertical: 10
          }
        }
      })
    })

    test('setOffsetBottom', () => {
      const vertical = 10

      mockWin.$zopim.livechat.button.setOffsetBottom(vertical)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          offset: {
            vertical: 10
          }
        }
      })
    })

    test('setOffsetHorizontal', () => {
      const horizontal = 10

      mockWin.$zopim.livechat.window.setOffsetHorizontal(horizontal)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          offset: {
            horizontal: 10
          }
        }
      })
    })

    test('setColor', () => {
      const color = '#ffffff'

      mockWin.$zopim.livechat.window.setColor(color)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          color: {
            theme: color
          }
        }
      })
    })

    describe('setPosition', () => {
      let position

      beforeEach(() => {
        mockWin.$zopim.livechat.window.setPosition(position)
      })

      describe('when the param is tm', () => {
        beforeAll(() => {
          position = 'tm'
        })

        it('calls updateSettingsApi with top', () => {
          expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
            webWidget: {
              position: {
                vertical: 'top'
              }
            }
          })
        })
      })

      describe('when the param is br', () => {
        beforeAll(() => {
          position = 'br'
        })

        it('calls updateSettingsApi with bottom right', () => {
          expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
            webWidget: {
              position: {
                vertical: 'bottom'
              }
            }
          })

          expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
            webWidget: {
              position: {
                horizontal: 'right'
              }
            }
          })
        })
      })

      describe('when the param is tl', () => {
        beforeAll(() => {
          position = 'tl'
        })

        it('calls updateSettingsApi with top left', () => {
          expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
            webWidget: {
              position: {
                vertical: 'top'
              }
            }
          })

          expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
            webWidget: {
              position: {
                horizontal: 'left'
              }
            }
          })
        })
      })
    })
  })

  describe('badge', () => {
    test('hide method', () => {
      mockWin.$zopim.livechat.badge.hide()

      expect(baseActions.badgeHideReceived).toHaveBeenCalled()
    })

    test('show method', () => {
      mockWin.$zopim.livechat.badge.show()

      expect(baseActions.badgeShowReceived).toHaveBeenCalled()
      expect(apis.showApi).toHaveBeenCalled()
    })

    test('setText', () => {
      const text = 'text'

      mockWin.$zopim.livechat.badge.setText(text)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          launcher: {
            badge: {
              label: {
                '*': text
              }
            }
          }
        }
      })
    })

    test('setColor', () => {
      const color = 'color'

      mockWin.$zopim.livechat.badge.setColor(color)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          color: {
            launcher: color
          }
        }
      })
    })

    test('setImage', () => {
      const image = 'image'

      mockWin.$zopim.livechat.badge.setImage(image)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          launcher: {
            badge: {
              image: image
            }
          }
        }
      })
    })

    test('setLayout', () => {
      const layout = 'layout'

      mockWin.$zopim.livechat.badge.setLayout(layout)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          launcher: {
            badge: {
              layout: layout
            }
          }
        }
      })
    })
  })

  describe('prechatForm', () => {
    test('setGreetings', () => {
      const greeting = 'greeting'

      mockWin.$zopim.livechat.prechatForm.setGreetings(greeting)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          chat: {
            prechatForm: {
              greeting: {
                '*': greeting
              }
            }
          }
        }
      })
    })
  })

  describe('offlineForm', () => {
    test('setGreetings', () => {
      const greeting = 'greeting'

      mockWin.$zopim.livechat.offlineForm.setGreetings(greeting)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          chat: {
            offlineForm: {
              greeting: {
                '*': greeting
              }
            }
          }
        }
      })
    })
  })

  describe('button', () => {
    test('hide', () => {
      mockWin.$zopim.livechat.button.hide()

      expect(apis.hideApi).toHaveBeenCalled()
    })

    test('show', () => {
      mockWin.$zopim.livechat.button.show()

      expect(apis.showApi).toHaveBeenCalled()
      expect(apis.closeApi).toHaveBeenCalled()
    })

    test('setHideWhenOffline', () => {
      mockWin.$zopim.livechat.button.setHideWhenOffline(true)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          chat: {
            hideWhenOffline: true
          }
        }
      })
    })

    describe('setPosition', () => {
      let isMobile = false,
        position

      beforeEach(() => {
        if (isMobile) {
          mockWin.$zopim.livechat.button.setPositionMobile(position)
        } else {
          mockWin.$zopim.livechat.button.setPosition(position)
        }
      })

      describe('when on desktop', () => {
        beforeAll(() => {
          isMobile = false
          position = 'tm'
        })

        it('calls updateSettingsApi with top', () => {
          expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
            webWidget: {
              position: {
                vertical: 'top'
              }
            }
          })
        })
      })

      describe('when on mobile', () => {
        beforeAll(() => {
          isMobile = true
          position = 'bm'
        })

        it('calls updateSettingsApi with bottom', () => {
          expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
            webWidget: {
              position: {
                vertical: 'bottom'
              }
            }
          })
        })
      })

      describe('when the param is br', () => {
        beforeAll(() => {
          position = 'br'
        })

        it('calls updateSettingsApi with bottom right', () => {
          expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
            webWidget: {
              position: {
                vertical: 'bottom'
              }
            }
          })

          expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
            webWidget: {
              position: {
                horizontal: 'right'
              }
            }
          })
        })
      })

      describe('when the param is tl', () => {
        beforeAll(() => {
          position = 'tl'
        })

        it('calls updateSettingsApi with top left', () => {
          expect(apis.updateSettingsApi).toHaveBeenNthCalledWith(2, mockStore, {
            webWidget: {
              position: {
                vertical: 'top'
              }
            }
          })

          expect(apis.updateSettingsApi).toHaveBeenNthCalledWith(1, mockStore, {
            webWidget: {
              position: {
                horizontal: 'left'
              }
            }
          })
        })
      })
    })

    test('setColor', () => {
      const color = '#ffffff'

      mockWin.$zopim.livechat.button.setColor(color)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: { color: { launcher: '#ffffff' } }
      })
    })

    test('setOffsetVertical', () => {
      const vertical = 10

      mockWin.$zopim.livechat.button.setOffsetVertical(vertical)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          offset: {
            vertical: 10
          }
        }
      })
    })

    test('setOffsetBottom', () => {
      const vertical = 10

      mockWin.$zopim.livechat.button.setOffsetBottom(vertical)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          offset: {
            vertical: 10
          }
        }
      })
    })

    test('setOffsetHorizontal', () => {
      const horizontal = 10

      mockWin.$zopim.livechat.button.setOffsetHorizontal(horizontal)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          offset: {
            horizontal: 10
          }
        }
      })
    })

    test('setOffsetVerticalMobile', () => {
      const vertical = 10

      mockWin.$zopim.livechat.button.setOffsetVerticalMobile(vertical)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          offset: {
            mobile: {
              vertical: 10
            }
          }
        }
      })
    })

    test('setOffsetHorizontalMobile', () => {
      const horizontal = 10

      mockWin.$zopim.livechat.button.setOffsetHorizontalMobile(horizontal)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          offset: {
            mobile: {
              horizontal: 10
            }
          }
        }
      })
    })
  })

  describe('theme', () => {
    test('setColor', () => {
      const color = '#ffffff'

      mockWin.$zopim.livechat.theme.setColor(color)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          color: {
            theme: color
          }
        }
      })
    })

    test('setColors', () => {
      const color = '#ffffff'

      mockWin.$zopim.livechat.theme.setColors({ primary: color })

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          color: {
            theme: color
          }
        }
      })
    })

    describe('setProfileCardConfig', () => {
      test('setProfileCardConfig', () => {
        mockWin.$zopim.livechat.theme.setProfileCardConfig({
          avatar: true,
          title: false,
          rating: true
        })

        expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
          webWidget: {
            chat: {
              profileCard: {
                avatar: true,
                title: false,
                rating: true
              }
            }
          }
        })
      })

      test('setProfileCardConfig with invalid values', () => {
        mockWin.$zopim.livechat.theme.setProfileCardConfig({
          avatar: 123,
          rating: false
        })

        expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
          webWidget: {
            chat: {
              profileCard: {
                rating: false
              }
            }
          }
        })
      })

      test('setProfileCardConfig with missing values', () => {
        mockWin.$zopim.livechat.theme.setProfileCardConfig({
          avatar: true
        })

        expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
          webWidget: {
            chat: {
              profileCard: {
                avatar: true
              }
            }
          }
        })
      })
    })
  })

  describe('mobileNotifications', () => {
    test('setDisabled', () => {
      mockWin.$zopim.livechat.mobileNotifications.setDisabled(true)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          chat: {
            notifications: {
              mobile: {
                disable: true
              }
            }
          }
        }
      })
    })
  })

  describe('departments', () => {
    test('setLabel method', () => {
      const label = 'da prechat form dep label'

      mockWin.$zopim.livechat.departments.setLabel(label)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          chat: {
            prechatForm: {
              departmentLabel: {
                '*': label
              }
            }
          }
        }
      })
    })

    test('getDepartment method', () => {
      mockWin.$zopim.livechat.departments.getDepartment(1)

      expect(apis.getDepartmentApi).toHaveBeenCalledWith(mockStore, 1)
    })

    test('getAllDepartments method', () => {
      mockWin.$zopim.livechat.departments.getAllDepartments()

      expect(apis.getAllDepartmentsApi).toHaveBeenCalled()
    })

    test('filter method', () => {
      mockWin.$zopim.livechat.departments.filter(1, 2, 3)

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          chat: {
            departments: {
              enabled: [1, 2, 3]
            }
          }
        }
      })
    })

    test('setVisitorDepartment method', () => {
      mockWin.$zopim.livechat.departments.setVisitorDepartment('sales')

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          chat: {
            departments: {
              select: 'sales'
            }
          }
        }
      })
    })

    test('clearVisitorDepartment method', () => {
      mockWin.$zopim.livechat.departments.clearVisitorDepartment()

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          chat: {
            departments: {
              select: ''
            }
          }
        }
      })
    })
  })

  describe('concierge', () => {
    test('setAvatar method', () => {
      mockWin.$zopim.livechat.concierge.setAvatar('123')

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          chat: {
            concierge: {
              avatarPath: '123'
            }
          }
        }
      })
    })

    test('setName method', () => {
      mockWin.$zopim.livechat.concierge.setName('123')

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          chat: {
            concierge: {
              name: '123'
            }
          }
        }
      })
    })

    test('setTitle method', () => {
      mockWin.$zopim.livechat.concierge.setTitle('123')

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        webWidget: {
          chat: {
            concierge: {
              title: { '*': '123' }
            }
          }
        }
      })
    })
  })

  test('setColor', () => {
    const color = '#ffffff'

    mockWin.$zopim.livechat.setColor(color)

    expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
      webWidget: {
        color: {
          theme: color
        }
      }
    })
  })

  test('hideAll', () => {
    mockWin.$zopim.livechat.hideAll()

    expect(apis.hideApi).toHaveBeenCalled()
  })

  describe('set', () => {
    it('calls $zopim.livechat.setName', () => {
      mockWin.$zopim.livechat.setName = jest.fn()

      mockWin.$zopim.livechat.set({ name: 'yolo' })
      expect(mockWin.$zopim.livechat.setName).toHaveBeenCalledWith('yolo')
    })

    it('calls $zopim.livechat.setEmail', () => {
      mockWin.$zopim.livechat.setEmail = jest.fn()

      mockWin.$zopim.livechat.set({ email: 'a@a.com' })
      expect(mockWin.$zopim.livechat.setEmail).toHaveBeenCalledWith('a@a.com')
    })

    it('calls $zopim.livechat.setColor', () => {
      mockWin.$zopim.livechat.setColor = jest.fn()

      mockWin.$zopim.livechat.set({ color: '#FFFFFF' })
      expect(mockWin.$zopim.livechat.setColor).toHaveBeenCalledWith('#FFFFFF')
    })

    it('allows setting of language', () => {
      jest.spyOn(mockWin.$zopim.livechat, 'setLanguage')

      mockWin.$zopim.livechat.set({ language: 'en' })
      expect(mockWin.$zopim.livechat.setLanguage).toHaveBeenCalledWith('en')
    })
  })

  test('isChatting', () => {
    mockWin.$zopim.livechat.isChatting()

    expect(apis.isChattingApi).toHaveBeenCalled()
  })

  test('say', () => {
    mockWin.$zopim.livechat.say('duran duran')

    expect(apis.sendChatMsgApi).toHaveBeenCalledWith(mockStore, 'duran duran')
  })

  test('endChat', () => {
    mockWin.$zopim.livechat.endChat()

    expect(apis.endChatApi).toHaveBeenCalled()
  })

  test('addTags', () => {
    expect(_.has(mockWin, '$zopim.livechat.addTags')).toEqual(true)
  })

  test('removeTags', () => {
    expect(_.has(mockWin, '$zopim.livechat.removeTags')).toEqual(true)
  })

  describe('setName', () => {
    describe('with valid input', () => {
      it('prefills and sets visitor info', () => {
        mockWin.$zopim.livechat.setName('wayne')

        expect(apis.prefill).toHaveBeenCalledWith(mockStore, {
          name: { value: 'wayne' }
        })

        expect(chatActions.setVisitorInfo).toHaveBeenCalledWith({
          display_name: 'wayne'
        }) // eslint-disable-line camelcase
      })
    })

    describe('with invalid input', () => {
      beforeEach(() => {
        jest.spyOn(console, 'warn')
        console.warn.mockReturnValue()
      })

      afterEach(() => {
        console.warn.mockRestore()
      })
      it('does not prefill, does not setVisitor info, does call console.warn', () => {
        mockWin.$zopim.livechat.setName('')

        expect(apis.prefill).not.toHaveBeenCalled()

        expect(chatActions.setVisitorInfo).not.toHaveBeenCalled()

        expect(console.warn).toHaveBeenCalledWith(`invalid name passed into setName: `)
      })
    })
  })

  describe('setEmail', () => {
    describe('with valid input', () => {
      it('prefills and sets visitor info', () => {
        mockWin.$zopim.livechat.setEmail('wayne@see.com')

        expect(apis.prefill).toHaveBeenCalledWith(mockStore, {
          email: { value: 'wayne@see.com' }
        })
        expect(chatActions.setVisitorInfo).toHaveBeenCalledWith({
          email: 'wayne@see.com'
        })
      })
    })
    describe('with invalid input', () => {
      beforeEach(() => {
        jest.spyOn(console, 'warn')
        console.warn.mockReturnValue()
      })

      afterEach(() => {
        console.warn.mockRestore()
      })

      describe('empty', () => {
        it('does not prefill or set visitor info, calls console.warning', () => {
          mockWin.$zopim.livechat.setEmail('')

          expect(apis.prefill).not.toHaveBeenCalled()
          expect(chatActions.setVisitorInfo).not.toHaveBeenCalled()

          expect(console.warn).toHaveBeenCalledWith(`invalid email passed into setEmail: `)
        })
      })

      describe('invalid email', () => {
        it('does not prefill or set visitor info, calls console.warning', () => {
          mockWin.$zopim.livechat.setEmail('bobby')

          expect(apis.prefill).not.toHaveBeenCalled()
          expect(chatActions.setVisitorInfo).not.toHaveBeenCalled()

          expect(console.warn).toHaveBeenCalledWith(`invalid email passed into setEmail: bobby`)
        })
      })
    })
  })

  describe('setPhone', () => {
    describe('with valid input', () => {
      it('prefills and sets visitor info', () => {
        mockWin.$zopim.livechat.setPhone('011111')

        expect(apis.prefill).toHaveBeenCalledWith(mockStore, {
          phone: { value: '011111' }
        })
        expect(chatActions.setVisitorInfo).toHaveBeenCalledWith({ phone: '011111' })
      })
    })

    describe('with invalid input', () => {
      beforeEach(() => {
        jest.spyOn(console, 'warn')
        console.warn.mockReturnValue()
      })

      afterEach(() => {
        console.warn.mockRestore()
      })

      it('does not prefill or set visitor info, calls console.warn', () => {
        mockWin.$zopim.livechat.setPhone('')

        expect(apis.prefill).not.toHaveBeenCalled()
        expect(chatActions.setVisitorInfo).not.toHaveBeenCalled()

        expect(console.warn).toHaveBeenCalledWith(`invalid phone number passed into setPhone: `)
      })

      it('does not prefill or set visitor info, calls console.warn', () => {
        mockWin.$zopim.livechat.setPhone('abcde')

        expect(apis.prefill).not.toHaveBeenCalled()
        expect(chatActions.setVisitorInfo).not.toHaveBeenCalled()

        expect(console.warn).toHaveBeenCalledWith(
          `invalid phone number passed into setPhone: abcde`
        )
      })
    })
  })

  test('sendVisitorPath', () => {
    mockWin.$zopim.livechat.sendVisitorPath(123)

    expect(apis.updatePathApi).toHaveBeenCalledWith(mockStore, 123)
  })

  test('clearAll', () => {
    mockWin.$zopim.livechat.clearAll()

    expect(apis.logoutApi).toHaveBeenCalled()
  })

  describe('setStatus', () => {
    let status

    beforeEach(() => {
      mockWin.$zopim.livechat.setStatus(status)
    })

    describe('when online', () => {
      beforeAll(() => {
        status = 'online'
      })

      it("calls setStatusForcefully with 'online'", () => {
        expect(chatActions.setStatusForcefully).toHaveBeenCalledWith('online')
      })
    })

    describe('when offline', () => {
      beforeAll(() => {
        status = 'offline'
      })

      it("calls setStatusForcefully with 'offline'", () => {
        expect(chatActions.setStatusForcefully).toHaveBeenCalledWith('offline')
      })
    })

    describe('when invalid value passed', () => {
      beforeAll(() => {
        status = 'offlwefhwouefhowhine'
      })

      it('does not call setStatusForcefully', () => {
        expect(chatActions.setStatusForcefully).not.toHaveBeenCalled()
      })
    })
  })

  describe('setDisableGoogleAnalytics', () => {
    let val

    beforeEach(() => {
      mockWin.$zopim.livechat.setDisableGoogleAnalytics(val)
    })

    describe('when set to true', () => {
      beforeAll(() => {
        val = true
      })

      it('sets analytics to false', () => {
        expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
          webWidget: {
            analytics: false
          }
        })
      })
    })

    describe('when set to false', () => {
      beforeAll(() => {
        val = false
      })

      it('sets analytics to true', () => {
        expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
          webWidget: {
            analytics: true
          }
        })
      })
    })
  })

  describe('setGreetings', () => {
    let mockGreetings

    beforeEach(() => {
      mockWin.$zopim.livechat.setGreetings(mockGreetings)
    })

    describe('when both online and offline vals provided', () => {
      beforeAll(() => {
        mockGreetings = {
          online: 'online yo',
          offline: 'offline yo'
        }
      })

      it('sets chatLabel correctly', () => {
        expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
          webWidget: {
            launcher: {
              chatLabel: {
                '*': 'online yo'
              }
            }
          }
        })
      })

      it('sets label correctly', () => {
        expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
          webWidget: {
            launcher: {
              label: {
                '*': 'offline yo'
              }
            }
          }
        })
      })
    })

    describe('when online only provided', () => {
      beforeAll(() => {
        mockGreetings = {
          online: 'online yo'
        }
      })

      it('sets chatLabel correctly', () => {
        expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
          webWidget: {
            launcher: {
              chatLabel: {
                '*': 'online yo'
              }
            }
          }
        })
      })
    })

    describe('when offline only provided', () => {
      beforeAll(() => {
        mockGreetings = {
          offline: 'offline yo'
        }
      })

      it('sets label correctly', () => {
        expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
          webWidget: {
            launcher: {
              label: {
                '*': 'offline yo'
              }
            }
          }
        })
      })
    })

    describe('when invalid values provided', () => {
      beforeAll(() => {
        mockGreetings = {
          online: 10,
          offline: null
        }
      })

      it('does not update settings', () => {
        expect(apis.updateSettingsApi).not.toHaveBeenCalled()
      })
    })
  })

  describe('cookieLaw', () => {
    test('setDefaultImplicitConsent', () => {
      mockWin.$zopim.livechat.cookieLaw.setDefaultImplicitConsent()

      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, {
        cookies: false
      })
    })
  })
})

describe('instrumentation', () => {
  const mockWin = {}

  beforeEach(() => {
    zopimApi.setUpZopimApiMethods(mockWin, mockStore)
  })

  it('instruments the zopim apis', () => {
    expect(tracker.addTo).toHaveBeenCalledWith(mockWin.$zopim.livechat, '$zopim.livechat')
    expect(tracker.addTo).toHaveBeenCalledWith(
      mockWin.$zopim.livechat.window,
      '$zopim.livechat.window'
    )
    expect(tracker.addTo).toHaveBeenCalledWith(
      mockWin.$zopim.livechat.button,
      '$zopim.livechat.button'
    )
    expect(tracker.addTo).toHaveBeenCalledWith(
      mockWin.$zopim.livechat.departments,
      '$zopim.livechat.departments'
    )
    expect(tracker.addTo).toHaveBeenCalledWith(
      mockWin.$zopim.livechat.concierge,
      '$zopim.livechat.concierge'
    )
    expect(tracker.addTo).toHaveBeenCalledWith(
      mockWin.$zopim.livechat.theme,
      '$zopim.livechat.theme'
    )
    expect(tracker.addTo).toHaveBeenCalledWith(
      mockWin.$zopim.livechat.mobileNotifications,
      '$zopim.livechat.mobileNotifications'
    )
    expect(tracker.addTo).toHaveBeenCalledWith(
      mockWin.$zopim.livechat.offlineForm,
      '$zopim.livechat.offlineForm'
    )
    expect(tracker.addTo).toHaveBeenCalledWith(
      mockWin.$zopim.livechat.prechatForm,
      '$zopim.livechat.prechatForm'
    )
  })
})
