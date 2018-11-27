import reducer from '../launcher-badge-settings';
import * as settingsActionTypes from 'src/redux/modules/settings/settings-action-types';

describe('launcher settings reducer', () => {
  const initialState = reducer(undefined, { type: '' });
  let expectedState,
    type,
    payload,
    result;

  beforeEach(() => {
    result = reducer(initialState, {
      type,
      payload
    });
  });

  describe('when a nonsense action is passed', () => {
    beforeAll(() => {
      type = 'RUBBISH';
    });

    it('returns the initial state', () => {
      expect(result).toEqual(initialState);
    });
  });

  describe('when an UPDATE_SETTINGS action is passed', () => {
    beforeAll(() => {
      type = settingsActionTypes.UPDATE_SETTINGS;
    });

    describe('when there is no payload', () => {
      beforeAll(() => {
        payload = undefined;
      });

      it('returns the initial state', () => {
        expect(result).toEqual(initialState);
      });
    });

    describe('when there is a payload', () => {
      describe('when the payload is incorrectly formed', () => {
        beforeAll(() => {
          payload = {
            foo: 'bar'
          };
        });

        it('does not update the state', () => {
          expect(result).toEqual(initialState);
        });
      });

      describe('when the payload is correctly formed', () => {
        beforeAll(() => {
          payload = {
            webWidget: {
              launcher: {
                badge: {
                  image: 'https://img.example.com/firefox.png',
                  label: {
                    '*': 'the best browser'
                  }
                }
              }
            }
          };

          expectedState = {
            ...initialState,
            image: 'https://img.example.com/firefox.png',
            label: {
              '*': 'the best browser'
            }
          };
        });

        it('returns the new updated state', () => {
          expect(result).toEqual(expectedState);
        });

        describe('when the payload contains a layout property', () => {
          const getPayload = (layout) => ({
            webWidget: {
              launcher: {
                badge: {
                  layout
                }
              }
            }
          });

          const getExpectedState = (initialState, layout) => ({
            ...initialState,
            layout
          });

          describe('when the layout is not acceptable', () => {
            describe('when the layout is empty', () => {
              payload = getPayload('');
              expectedState = getExpectedState(initialState, initialState.layout);

              it('returns the layout initial state', () => {
                expect(result).toEqual(expectedState);
              });
            });

            describe('when the layout is not supported', () => {
              payload = getPayload('herp_derp');
              expectedState = getExpectedState(initialState, initialState.layout);

              it('returns the layout initial state', () => {
                expect(result).toEqual(expectedState);
              });
            });
          });

          describe('when the layout is acceptable', () => {
            payload = getPayload('image_only');
            expectedState = getExpectedState(initialState, 'image_only');

            it('returns the new updated state', () => {
              expect(result).toEqual(expectedState);
            });
          });
        });
      });
    });
  });
});
