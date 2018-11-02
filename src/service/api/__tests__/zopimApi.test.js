import { zopimApi } from '../zopimApi';

jest.mock('src/service/api/apis');

import * as apis from 'src/service/api/apis';

const mockStore = {
  dispatch: jest.fn()
};

beforeEach(() => {
  zopimApi.setZopimExistsOnPage(false);
});

describe('handleZopimQueue', () => {
  it('calls queue item if it is function', () => {
    const methodSpy = jest.fn();

    zopimApi.handleZopimQueue([ methodSpy ]);

    expect(methodSpy)
      .toHaveBeenCalled();
  });

  it('throws an error if queue item is not function', () => {
    expect(() => {
      zopimApi.handleZopimQueue([ undefined ]);
    }).toThrowError('An error occurred in your use of the $zopim Widget API');
  });
});

describe('setupZopimQueue', () => {
  describe('when $zopim has not been defined on the window', () => {
    const mockWin = {};

    beforeEach(() => {
      zopimApi.setupZopimQueue(mockWin, []);
    });

    describe('creates a zopim global function with', () => {
      it('a queue', () => {
        expect(mockWin.$zopim._)
          .toEqual([]);
      });

      it('a set function', () => {
        expect(mockWin.$zopim.set)
          .toEqual(expect.any(Function));
      });

      it('a set function queue', () => {
        expect(mockWin.$zopim.set._)
          .toEqual([]);
      });
    });

    describe('when the $zopim global function is called', () => {
      beforeEach(() => {
        mockWin.$zopim('mockApiCall');
      });

      it('queues the call', () => {
        expect(mockWin.$zopim._)
          .toContain('mockApiCall');
      });
    });

    describe('when $zopim has already been defined on the window', () => {
      const mockWin = { $zopim: 'already defined!!' };

      beforeEach(() => {
        zopimApi.setupZopimQueue(mockWin, mockStore);
      });

      it('does not override $zopim on win', () => {
        expect(mockWin.$zopim)
          .toEqual('already defined!!');
      });
    });
  });

  describe('setUpZopimApiMethods', () => {
    const mockWin = {};

    beforeEach(() => {
      zopimApi.setUpZopimApiMethods(mockWin, mockStore);
    });

    describe('window', () => {
      test('toggle method', () => {
        mockWin.$zopim.livechat.window.toggle();

        expect(apis.toggleApi)
          .toHaveBeenCalled();
      });

      test('hide method', () => {
        mockWin.$zopim.livechat.window.hide();

        expect(apis.hideApi)
          .toHaveBeenCalled();
      });

      test('show method', () => {
        mockWin.$zopim.livechat.window.show();

        expect(apis.openApi)
          .toHaveBeenCalled();
      });

      test('getDisplay method', () => {
        mockWin.$zopim.livechat.window.getDisplay();

        expect(apis.displayApi)
          .toHaveBeenCalled();
      });

      test('setTitle', () => {
        const title = 'title';

        mockWin.$zopim.livechat.window.setTitle(title);

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, {
            webWidget: {
              chat: {
                title: {
                  '*': title
                }
              }
            }
          });
      });
    });

    describe('prechatForm', () => {
      test('setGreetings', () => {
        const greeting = 'greeting';

        mockWin.$zopim.livechat.prechatForm.setGreetings(greeting);

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, {
            webWidget: {
              chat: {
                prechatForm: {
                  greeting: {
                    '*': greeting
                  }
                }
              }
            }
          });
      });
    });

    describe('offlineForm', () => {
      test('setGreetings', () => {
        const greeting = 'greeting';

        mockWin.$zopim.livechat.offlineForm.setGreetings(greeting);

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, {
            webWidget: {
              chat: {
                offlineForm: {
                  greeting: {
                    '*': greeting
                  }
                }
              }
            }
          });
      });
    });

    describe('button', () => {
      test('hide method', () => {
        mockWin.$zopim.livechat.button.hide();

        expect(apis.hideApi)
          .toHaveBeenCalled();
      });

      test('show method', () => {
        mockWin.$zopim.livechat.button.show();

        expect(apis.showApi)
          .toHaveBeenCalled();
        expect(apis.closeApi)
          .toHaveBeenCalled();
      });
    });

    test('hideAll method', () => {
      mockWin.$zopim.livechat.hideAll();

      expect(apis.hideApi)
        .toHaveBeenCalled();
    });

    test('set method', () => {
      mockWin.$zopim.livechat.set({ x: 1 });

      expect(apis.updateSettingsApi)
        .toHaveBeenCalledWith(mockStore, { x: 1 });
    });

    test('isChatting method', () => {
      mockWin.$zopim.livechat.isChatting();

      expect(apis.isChattingApi)
        .toHaveBeenCalled();
    });

    describe('departments', () => {
      test('getAllDepartments method', () => {
        mockWin.$zopim.livechat.departments.getAllDepartments();

        expect(apis.getAllDepartmentsApi)
          .toHaveBeenCalled();
      });

      test('getDepartment method', () => {
        mockWin.$zopim.livechat.departments.getDepartment(1);

        expect(apis.getDepartmentApi)
          .toHaveBeenCalledWith(mockStore, 1);
      });

      test('filter method', () => {
        mockWin.$zopim.livechat.departments.filter(1, 2, 3);

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, {
            webWidget: {
              chat: {
                departments: {
                  enabled: [1, 2, 3]
                }
              }
            }
          });
      });

      test('setVisitorDepartment method', () => {
        mockWin.$zopim.livechat.departments.setVisitorDepartment('sales');

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, {
            webWidget: {
              chat: {
                departments: {
                  select: 'sales'
                }
              }
            }
          });
      });

      test('clearVisitorDepartment method', () => {
        mockWin.$zopim.livechat.departments.clearVisitorDepartment();

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, {
            webWidget: {
              chat: {
                departments: {
                  select: ''
                }
              }
            }
          });
      });

      test('setLabel method', () => {
        const label = 'da prechat form dep label';

        mockWin.$zopim.livechat.departments.setLabel(label);

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, {
            webWidget: {
              chat: {
                prechatForm: {
                  departmentLabel: {
                    '*': label
                  }
                }
              }
            }
          });
      });
    });

    test('say method', () => {
      mockWin.$zopim.livechat.say('duran duran');

      expect(apis.sendChatMsgApi)
        .toHaveBeenCalledWith(mockStore, 'duran duran');
    });

    test('endChat method', () => {
      mockWin.$zopim.livechat.endChat();

      expect(apis.endChatApi)
        .toHaveBeenCalled();
    });

    describe('removeTags method', () => {
      let store;

      beforeEach(() => {
        zopimApi.setZopimExistsOnPage(false);
        store = {
          getState: () => ({
            settings: {
              chat: {
                tags: ['old', 'state', 'zopim']
              }
            }
          })
        };

        zopimApi.setUpZopimApiMethods(mockWin, store);
      });

      it('removes tags sent as parameter', () => {
        mockWin.$zopim.livechat.removeTags('zopim', 'another');

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(store, {
            webWidget: {
              chat: {
                tags: ['old', 'state']
              }
            }
          });
      });
    });

    describe('addTags method', () => {
      let store;

      beforeEach(() => {
        zopimApi.setZopimExistsOnPage(false);
        store = {
          getState: () => ({
            settings: {
              chat: {
                tags: ['old', 'state', 'zopim']
              }
            }
          })
        };

        zopimApi.setUpZopimApiMethods(mockWin, store);
      });

      it('adds tags sent as parameter', () => {
        mockWin.$zopim.livechat.addTags('zopim2', 'another');

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(store, {
            webWidget: {
              chat: {
                tags: ['old', 'state', 'zopim', 'zopim2', 'another']
              }
            }
          });
      });
    });

    test('setName method', () => {
      mockWin.$zopim.livechat.setName('wayne');

      expect(apis.prefill)
        .toHaveBeenCalledWith(mockStore, { name: { value: 'wayne' }});
    });

    test('setEmail method', () => {
      mockWin.$zopim.livechat.setEmail('wayne@see.com');

      expect(apis.prefill)
        .toHaveBeenCalledWith(mockStore, { email: { value: 'wayne@see.com' }});
    });

    test('setPhone method', () => {
      mockWin.$zopim.livechat.setPhone('011111');

      expect(apis.prefill)
        .toHaveBeenCalledWith(mockStore, { phone: { value: '011111' }});
    });

    test('clearAll method', () => {
      mockWin.$zopim.livechat.clearAll();

      expect(apis.logoutApi)
        .toHaveBeenCalled();
    });

    test('sendVisitorPath method', () => {
      mockWin.$zopim.livechat.sendVisitorPath(123);

      expect(apis.updatePathApi)
        .toHaveBeenCalledWith(mockStore, 123);
    });

    describe('concierge', () => {
      test('setAvatar method', () => {
        mockWin.$zopim.livechat.concierge.setAvatar('123');

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, {
            webWidget: {
              chat: {
                concierge: {
                  avatarPath: '123'
                }
              }
            }
          });
      });

      test('setName method', () => {
        mockWin.$zopim.livechat.concierge.setName('123');

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, {
            webWidget: {
              chat: {
                concierge: {
                  name: '123'
                }
              }
            }
          });
      });

      test('setTitle method', () => {
        mockWin.$zopim.livechat.concierge.setTitle('123');

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, {
            webWidget: {
              chat: {
                concierge: {
                  title: { '*': '123' }
                }
              }
            }
          });
      });
    });

    describe('theme', () => {
      test('setProfileCardConfig', () => {
        mockWin.$zopim.livechat.theme.setProfileCardConfig({
          avatar: true,
          title: false,
          rating: true
        });

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, {
            webWidget: {
              chat: {
                profileCard: {
                  avatar: true,
                  title: false,
                  rating: true
                }
              }
            }
          });
      });

      test('setProfileCardConfig with invalid values', () => {
        mockWin.$zopim.livechat.theme.setProfileCardConfig({
          avatar: 123,
          rating: false
        });

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, {
            webWidget: {
              chat: {
                profileCard: {
                  rating: false
                }
              }
            }
          });
      });

      test('setProfileCardConfig with missing values', () => {
        mockWin.$zopim.livechat.theme.setProfileCardConfig({
          avatar: true
        });

        expect(apis.updateSettingsApi)
          .toHaveBeenCalledWith(mockStore, {
            webWidget: {
              chat: {
                profileCard: {
                  avatar: true
                }
              }
            }
          });
      });
    });
  });
});
