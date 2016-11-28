describe('service.automaticAnswersPersistence', () => {
  let automaticAnswersPersistence,
    store,
    mockUrlJwtToken,
    mockJWTStorageItem,
    mockJwtBody,
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
        getURLParameterByName: jasmine.createSpy().and.callFake(() => mockUrlJwtToken),
        getDecodedJWTBody: jasmine.createSpy().and.callFake(() => mockJwtBody)
      }
    });

    mockery.registerAllowable(automaticAnswersPersistencePath);
    automaticAnswersPersistence = requireUncached(automaticAnswersPersistencePath).automaticAnswersPersistence;

    mockJwtBody = {
      'ticket_id': 123456,
      'token': 'abcdef'
    };
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('store', () => {
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
    });

    describe('when auth_token does not exist in the url', () => {
      beforeEach(() => {
        mockUrlJwtToken = null;
      });

      describe('and an automaticAnswers item exists in local storage', () => {
        describe('when auth_token has not expired', () => {
          beforeEach(() => {
            mockJWTStorageItem = {
              authToken: '1324b235.2342ccdsc.9a8sdcy9',
              expiry: Date.now() + 1
            };
          });

          it('gets the jwt auth_token from the automaticAnswers local storage item', () => {
            automaticAnswersPersistence.getContext();

            expect(store.get)
              .toHaveBeenCalledWith('automaticAnswers');
          });
        });

        describe('when auth_token has expired', () => {
          beforeEach(() => {
            mockJWTStorageItem = {
              authToken: '1324b235.2342ccdsc.9a8sdcy9',
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
