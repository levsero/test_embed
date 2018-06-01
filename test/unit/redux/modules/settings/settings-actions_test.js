import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  mockStore,
  mockGetConnection,
  mockGetDepartmentsList;

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);
const chatConstantsPath = buildSrcPath('constants/chat');
const chatConstants = requireUncached(chatConstantsPath);
const CONNECTION_STATUSES = chatConstants.CONNECTION_STATUSES;

let setDepartmentSpy = jasmine.createSpy('setDepartment').and.returnValue({ type: 'yolo' });
let clearDepartmentSpy = jasmine.createSpy('clearDepartment').and.returnValue({ type: 'yolo'});

describe('settings redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    const actionsPath = buildSrcPath('redux/modules/settings');
    const actionTypesPath = buildSrcPath('redux/modules/settings/settings-action-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);
    mockery.registerAllowable(chatConstantsPath);

    initMockRegistry({
      'constants/chat': {
        CONNECTION_STATUSES
      },
      'src/redux/modules/chat/chat-selectors': {
        getConnection: () => mockGetConnection,
        getDepartmentsList: () => mockGetDepartmentsList
      },
      'src/redux/modules/chat/chat-actions': {
        setDepartment: setDepartmentSpy,
        clearDepartment: clearDepartmentSpy
      }
    });

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);

    mockStore = createMockStore({ settings: {} });
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('updateSettings', () => {
    let someSettings;

    beforeEach(() => {
      mockStore.dispatch(actions.updateSettings(someSettings));
    });

    afterEach(() => {
      setDepartmentSpy.calls.reset();
      clearDepartmentSpy.calls.reset();
    });

    describe('when chat is connected', () => {
      beforeAll(() => {
        mockGetConnection = CONNECTION_STATUSES.CONNECTED;
        mockGetDepartmentsList = [{ name: 'yo', id: 123 }, { name: 'yoyo', id: 345 }];
      });

      describe('when given valid department name', () => {
        beforeAll(() => {
          someSettings = {
            chat: {
              visitor: {
                departments: {
                  department: 'yo'
                }
              }
            }
          };
        });

        it('calls setDepartment with the correct args', () => {
          expect(setDepartmentSpy)
            .toHaveBeenCalledWith(123);
        });

        it('dispatches updateSettings action', () => {
          const expected = {
            type: actionTypes.UPDATE_SETTINGS,
            payload: {
              webWidget: {
                ...someSettings
              }
            }
          };

          expect(mockStore.getActions()[0])
            .toEqual(expected);
        });
      });

      describe('when given an invalid department name', () => {
        beforeAll(() => {
          someSettings = {
            webWidget: {
              chat: {
                visitor: {
                  departments: {
                    department: 'yowrgfwewe'
                  }
                }
              }
            }
          };
        });

        it('calls clearDepartment', () => {
          expect(clearDepartmentSpy)
            .toHaveBeenCalled();
        });

        it('dispatches updateSettings action', () => {
          const expected = {
            type: actionTypes.UPDATE_SETTINGS,
            payload: someSettings
          };

          expect(mockStore.getActions()[0])
            .toEqual(expected);
        });
      });
    });

    describe('when chat is not connected', () => {
      beforeAll(() => {
        mockGetConnection = CONNECTION_STATUSES.CONNECTING;
      });

      it('does not call setDepartment', () => {
        expect(setDepartmentSpy)
          .not
          .toHaveBeenCalled();
      });

      it('does not call clearDepartment', () => {
        expect(clearDepartmentSpy)
          .not
          .toHaveBeenCalled();
      });

      it('dispatches updateSettings action', () => {
        const expected = {
          type: actionTypes.UPDATE_SETTINGS,
          payload: someSettings
        };

        expect(mockStore.getActions()[0])
          .toEqual(expected);
      });
    });
  });

  describe('updateSettingsChatSuppress', () => {
    let action;

    beforeEach(() => {
      const suppress = true;

      mockStore.dispatch(actions.updateSettingsChatSuppress(suppress));
      action = mockStore.getActions()[0];
    });

    it('updates settings for chat suppress to true', () => {
      const expected = {
        type: actionTypes.UPDATE_SETTINGS_CHAT_SUPPRESS,
        payload: true
      };

      expect(action)
        .toEqual(expected);
    });
  });

  describe('resetSettingsChatSuppress', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.resetSettingsChatSuppress());
      action = mockStore.getActions()[0];
    });

    it('resets settings for chat suppress to its original state', () => {
      const expected = { type: actionTypes.RESET_SETTINGS_CHAT_SUPPRESS };

      expect(action)
        .toEqual(expected);
    });
  });
});
