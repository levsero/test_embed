import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  mockStore,
  mockGetConnection,
  mockGetSettingsChatTags,
  mockGetSettingsChatOldTags,
  mockDepartment = { name: 'police', id: 1 };

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);
const chatConstantsPath = buildSrcPath('constants/chat');
const chatConstants = requireUncached(chatConstantsPath);
const CONNECTION_STATUSES = chatConstants.CONNECTION_STATUSES;

let setDepartmentSpy = jasmine.createSpy('setDepartment').and.returnValue({ type: 'yolo' });
let clearDepartmentSpy = jasmine.createSpy('clearDepartment').and.returnValue({ type: 'yolo' });
let addTagSpy = jasmine.createSpy('addTag');
let removeTagSpy = jasmine.createSpy('removeTag');
let getSettingsChatTagsSpy = jasmine.createSpy('getSettingsChatTags');

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
        getDefaultSelectedDepartment: () => mockDepartment,
        getZChatVendor: () => {
          return {
            addTag: addTagSpy,
            removeTag: removeTagSpy
          };
        }
      },
      'src/redux/modules/chat/chat-actions': {
        setDepartment: setDepartmentSpy,
        clearDepartment: clearDepartmentSpy
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsChatTags: getSettingsChatTagsSpy,
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
      getSettingsChatTagsSpy.and.returnValues(mockGetSettingsChatOldTags, mockGetSettingsChatTags);

      mockStore.dispatch(actions.updateSettings(someSettings));
    });

    afterEach(() => {
      setDepartmentSpy.calls.reset();
      clearDepartmentSpy.calls.reset();
      removeTagSpy.calls.reset();
      addTagSpy.calls.reset();
      getSettingsChatTagsSpy.calls.reset();
    });

    describe('when chat is connected', () => {
      beforeAll(() => {
        mockGetConnection = CONNECTION_STATUSES.CONNECTED;
      });

      describe('when given valid department name', () => {
        it('calls setDepartment with the correct args', () => {
          expect(setDepartmentSpy)
            .toHaveBeenCalledWith(1);
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

      describe('when new tags are present', () => {
        beforeAll(() => {
          mockGetSettingsChatTags = ['firstTagYolo', 'secondTagYolo'];
          mockGetSettingsChatOldTags = [];
          someSettings = {
            chat: {
              tags: ['firstTagYolo', 'secondTagYolo']
            }
          };
        });

        it('calls addTag exactly twice', () => {
          expect(addTagSpy.calls.count())
            .toEqual(2);
        });

        it('adds firstTagYolo', () => {
          expect(addTagSpy.calls.argsFor(0)[0])
            .toEqual('firstTagYolo');
        });

        it('adds secondTagYolo', () => {
          expect(addTagSpy.calls.argsFor(1)[0])
            .toEqual('secondTagYolo');
        });

        describe('when old tags are present', () => {
          beforeAll(() => {
            mockGetSettingsChatOldTags = ['firstTag', 'secondTag'];
            mockGetSettingsChatTags = [];
          });

          it('calls removeTag exactly twice', () => {
            expect(removeTagSpy.calls.count())
              .toEqual(2);
          });

          it('removes firstTag', () => {
            expect(removeTagSpy.calls.argsFor(0)[0])
              .toEqual('firstTag');
          });

          it('removes secondTag', () => {
            expect(removeTagSpy.calls.argsFor(1)[0])
              .toEqual('secondTag');
          });
        });

        describe('when olds tags are not present', () => {
          beforeAll(() => {
            mockGetSettingsChatOldTags = [];
          });

          it('does not call removeTag', () => {
            expect(removeTagSpy)
              .not
              .toHaveBeenCalled();
          });
        });
      });
    });

    describe('when chat is not connected', () => {
      beforeAll(() => {
        mockGetConnection = CONNECTION_STATUSES.CONNECTING;
        someSettings = {
          webWidget: {
            chat: {
              departments: {
                select: 'yo'
              }
            }
          }
        };
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

      it('does not call addTag', () => {
        expect(addTagSpy)
          .not
          .toHaveBeenCalled();
      });

      it('does not call removeTag', () => {
        expect(removeTagSpy)
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
});
