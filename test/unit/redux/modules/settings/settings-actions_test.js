import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

let actions,
  actionTypes,
  mockStore,
  mockGetConnection,
  mockGetSettingsChatTags,
  mockGetSettingsChatOldTags,
  mockDepartment = { name: 'police', id: 1 }

const middlewares = [thunk]
const createMockStore = configureMockStore(middlewares)
const chatConstantsPath = buildSrcPath('constants/chat')
const chatConstants = requireUncached(chatConstantsPath)
const CONNECTION_STATUSES = chatConstants.CONNECTION_STATUSES

let setDepartmentSpy = jasmine.createSpy('setDepartment').and.returnValue({ type: 'yolo' })
let clearDepartmentSpy = jasmine.createSpy('clearDepartment').and.returnValue({ type: 'yolo' })
let addTagsSpy = jasmine.createSpy('addTag')
let removeTagsSpy = jasmine.createSpy('removeTag')
let getSettingsChatTagsSpy = jasmine.createSpy('getSettingsChatTags')

describe('settings redux actions', () => {
  beforeEach(() => {
    mockery.enable()

    const actionsPath = buildSrcPath('redux/modules/settings')
    const actionTypesPath = buildSrcPath('redux/modules/settings/settings-action-types')

    mockery.registerAllowable(actionsPath)
    mockery.registerAllowable(actionTypesPath)
    mockery.registerAllowable(chatConstantsPath)

    initMockRegistry({
      'constants/chat': {
        CONNECTION_STATUSES
      },
      'src/redux/modules/chat/chat-selectors': {
        getConnection: () => mockGetConnection,
        getZChatVendor: () => {
          return {
            addTags: addTagsSpy,
            removeTags: removeTagsSpy
          }
        }
      },
      'src/redux/modules/selectors': {
        getDefaultSelectedDepartment: () => mockDepartment
      },
      'src/redux/modules/chat': {
        setDepartment: setDepartmentSpy,
        clearDepartment: clearDepartmentSpy
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsChatTags: getSettingsChatTagsSpy
      }
    })

    actions = requireUncached(actionsPath)
    actionTypes = requireUncached(actionTypesPath)

    mockStore = createMockStore({ settings: {} })
  })

  afterEach(() => {
    mockery.disable()
    mockery.deregisterAll()
  })

  describe('updateSettings', () => {
    let someSettings

    beforeEach(() => {
      getSettingsChatTagsSpy.and.returnValues(mockGetSettingsChatOldTags, mockGetSettingsChatTags)

      mockStore.dispatch(actions.updateSettings(someSettings))
    })

    afterEach(() => {
      setDepartmentSpy.calls.reset()
      clearDepartmentSpy.calls.reset()
      removeTagsSpy.calls.reset()
      addTagsSpy.calls.reset()
      getSettingsChatTagsSpy.calls.reset()
    })

    describe('when chat is connected', () => {
      beforeAll(() => {
        mockGetConnection = CONNECTION_STATUSES.CONNECTED
      })

      describe('when given valid department name', () => {
        it('calls setDepartment with the correct args', () => {
          expect(setDepartmentSpy).toHaveBeenCalledWith(1)
        })

        it('dispatches updateSettings action', () => {
          const expected = {
            type: actionTypes.UPDATE_SETTINGS,
            payload: {
              webWidget: {
                ...someSettings
              }
            }
          }

          expect(mockStore.getActions()[0]).toEqual(expected)
        })
      })

      describe('when new tags are present', () => {
        const newTags = ['firstTagYolo', 'secondTagYolo']

        beforeAll(() => {
          mockGetSettingsChatTags = newTags
          mockGetSettingsChatOldTags = []
          someSettings = {
            chat: {
              tags: newTags
            }
          }
        })

        it('calls addTags', () => {
          expect(addTagsSpy.calls.count()).toEqual(1)
        })

        it('adds the array of new tags', () => {
          expect(addTagsSpy.calls.argsFor(0)[0]).toEqual(newTags)
        })

        describe('when old tags are present', () => {
          const oldTags = ['firstTag', 'secondTag']

          beforeAll(() => {
            mockGetSettingsChatOldTags = oldTags
            mockGetSettingsChatTags = []
          })

          it('calls removeTags', () => {
            expect(removeTagsSpy.calls.count()).toEqual(1)
          })

          it('removes firstTag', () => {
            expect(removeTagsSpy.calls.argsFor(0)[0]).toEqual(oldTags)
          })
        })

        describe('when olds tags are not present', () => {
          beforeAll(() => {
            mockGetSettingsChatOldTags = []
          })

          it('does not call removeTag', () => {
            expect(removeTagsSpy).not.toHaveBeenCalled()
          })
        })
      })
    })

    describe('when chat is not connected', () => {
      beforeAll(() => {
        mockGetConnection = CONNECTION_STATUSES.CONNECTING
        someSettings = {
          webWidget: {
            chat: {
              departments: {
                select: 'yo'
              }
            }
          }
        }
      })

      it('does not call setDepartment', () => {
        expect(setDepartmentSpy).not.toHaveBeenCalled()
      })

      it('does not call clearDepartment', () => {
        expect(clearDepartmentSpy).not.toHaveBeenCalled()
      })

      it('does not call addTags', () => {
        expect(addTagsSpy).not.toHaveBeenCalled()
      })

      it('does not call removeTags', () => {
        expect(removeTagsSpy).not.toHaveBeenCalled()
      })

      it('dispatches updateSettings action', () => {
        const expected = {
          type: actionTypes.UPDATE_SETTINGS,
          payload: someSettings
        }

        expect(mockStore.getActions()[0]).toEqual(expected)
      })
    })
  })
})
