describe('service.automaticAnswersPersistence', () => {
  let automaticAnswersPersistence,
    store,
    mockUrlJwtToken,
    mockJWTStorageItem,
    mockRegistry;
  const automaticAnswersPersistencePath = buildSrcPath('service/automaticAnswersPersistence');

  beforeEach(() => {
    mockery.enable();
    jasmine.clock().mockDate(new Date());
    mockRegistry = initMockRegistry({
      'service/persistence': {
        store: {
          get: jasmine.createSpy().and.callFake(() => mockJWTStorageItem),
          set: jasmine.createSpy(),
          remove: jasmine.createSpy('store.remove')
        }
      },
      'utility/pages': {
        getURLParameterByName: jasmine.createSpy().and.callFake(() => mockUrlJwtToken)
      }
    });

    mockery.registerAllowable(automaticAnswersPersistencePath);
    automaticAnswersPersistence = requireUncached(automaticAnswersPersistencePath).automaticAnswersPersistence;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('getContext', () => {
    beforeEach(() => {
      store = mockRegistry['service/persistence'].store;
    });

    describe('when auth_token exists in the url', () => {
      beforeEach(() => {
        mockUrlJwtToken = '1324b235.2342ccdsc.9a8sdcy9';
      });

      it('saves the jwt auth_token to the automaticAnswers local storage item', () => {
        automaticAnswersPersistence.getContext();

        expect(store.set)
          .toHaveBeenCalledWith('automaticAnswers', { authToken: mockUrlJwtToken, expiry: Date.now() + 86400000 });
      });

      it('returns the jwt auth_token', () => {
        expect(automaticAnswersPersistence.getContext())
          .toEqual(mockUrlJwtToken);
      });
    });

    describe('when auth_token does not exist in the url', () => {
      beforeEach(() => {
        mockUrlJwtToken = null;
      });

      describe('and an automaticAnswers item exists in local storage', () => {
        describe('when auth_token has not expired', () => {
          beforeEach(() => {
            mockJWTStorageItem = {
              authToken: '9a8sdcy.92342ccdsc.1324b235',
              expiry: Date.now() + 1
            };
          });

          it('gets the jwt auth_token from the automaticAnswers local storage item', () => {
            automaticAnswersPersistence.getContext();

            expect(store.get)
              .toHaveBeenCalledWith('automaticAnswers');
          });

          it('returns the jwt auth_token', () => {
            expect(automaticAnswersPersistence.getContext())
              .toEqual(mockJWTStorageItem.authToken);
          });
        });

        describe('when auth_token has expired', () => {
          beforeEach(() => {
            mockJWTStorageItem = {
              authToken: '9a8sdcy.92342ccdsc.1324b235',
              expiry: Date.now() - 20
            };
          });

          it('returns null', () => {
            expect(automaticAnswersPersistence.getContext())
              .toBeNull();
          });
        });
      });

      describe('and an automaticAnswers item does not exist in local storage', () => {
        beforeEach(() => {
          mockJWTStorageItem = null;
        });

        it('returns null', () => {
          expect(store.set)
            .not.toHaveBeenCalled();
          expect(automaticAnswersPersistence.getContext())
            .toBeNull();
        });
      });
    });
  });
});
