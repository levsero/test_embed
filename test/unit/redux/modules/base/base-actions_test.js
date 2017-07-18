import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  mockStore;

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('base redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    const actionsPath = buildSrcPath('redux/modules/base');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);

    mockStore = createMockStore({ base: {} });
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('updateActiveEmbed', () => {
    let embed,
      action;

    beforeEach(() => {
      embed = 'helpCenter';
      mockStore.dispatch(actions.updateActiveEmbed(embed));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_ACTIVE_EMBED', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_ACTIVE_EMBED);
    });

    it('has the embed in the payload', () => {
      expect(action.payload)
        .toEqual(embed);
    });
  });

  describe('updateEmbedAccessible', () => {
    let embed,
      accessible,
      action;

    beforeEach(() => {
      embed = 'helpCenter';
      accessible = true;
      mockStore.dispatch(actions.updateEmbedAccessible(embed, accessible));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_EMBED', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_EMBED);
    });

    it('has a name property in the payload', () => {
      expect(action.payload)
        .toEqual(jasmine.objectContaining({ name: embed }));
    });

    it('has an accessible property in the payload', () => {
      expect(action.payload)
        .toEqual(jasmine.objectContaining({ params: { accessible } }));
    });
  });

  describe('updateZopimOnline', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateZopimOnline(true));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_ZOPIM_ONLINE', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_ZOPIM_ONLINE);
    });

    it('has the value in the payload', () => {
      expect(action.payload)
        .toEqual(true);
    });
  });

  describe('updateBackButtonVisibility', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateBackButtonVisibility(true));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_BACK_BUTTON_VISIBILITY', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_BACK_BUTTON_VISIBILITY);
    });

    it('has the value in the payload', () => {
      expect(action.payload)
        .toEqual(true);
    });
  });
});
