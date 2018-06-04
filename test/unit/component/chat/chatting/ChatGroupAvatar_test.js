import { ChatGroupAvatar } from '../../../../../src/component/chat/chatting/ChatGroupAvatar';

describe('ChatGroupAvatar class', () => {
  let parentProps,
    isAgent,
    showAvatar,
    avatarPath,
    socialLogin,
    subject;

  beforeEach(() => {
    parentProps = {
      socialLogin: socialLogin,
      showAvatar: showAvatar,
      avatarPath: avatarPath,
      isAgent: isAgent
    };

    subject = new ChatGroupAvatar(parentProps);
  });

  afterEach(() => {
  });

  describe('constructor', () => {
    beforeAll(() => {
      socialLogin = { avatarPath: 'heynow' };
      showAvatar = true;
      avatarPath = 'wassup';
      isAgent = true;
    });

    describe('properties', () => {
      it('contains a socialLogin property', () => {
        expect(subject.socialLogin).toEqual(socialLogin);
      });

      it('contains a showAvatar property', () => {
        expect(subject.showAvatar).toEqual(showAvatar);
      });

      it('contains a avatarPath property', () => {
        expect(subject.avatarPath).toEqual(avatarPath);
      });

      it('contains a isAgent property', () => {
        expect(subject.isAgent).toEqual(isAgent);
      });
    });

    describe('#path', () => {
      describe('when the sender is a user who is logged in via social media', () => {
        beforeAll(() => {
          isAgent = false;
          socialLogin = { avatarPath: 'heynow' };
        });

        it('returns a path to the social media avatar', () => {
          expect(subject.path()).toEqual('heynow');
        });
      });

      describe('when the sender is an agent', () => {
        beforeAll(() => {
          isAgent = true;
          avatarPath = 'wassup';
        });

        it('returns a path to the social media avatar', () => {
          expect(subject.path()).toEqual('wassup');
        });
      });
    });

    describe('#shouldDisplay', () => {
      describe('when the showAvatar property is false', () => {
        beforeAll(() => {
          showAvatar = false;
        });

        it('returns false', () => {
          expect(subject.shouldDisplay()).toEqual(false);
        });
      });

      describe('when the showAvatar property is true', () => {
        describe('when the sender is an agent', () => {
          beforeAll(() => {
            isAgent = true;
            showAvatar = true;
          });

          it('returns true', () => {
            expect(subject.shouldDisplay()).toEqual(true);
          });
        });

        describe('when the sender is an end-user', () => {
          beforeAll(() => {
            isAgent = false;
            showAvatar = true;
          });

          it('also returns true', () => {
            expect(subject.shouldDisplay()).toEqual(true);
          });
        });
      });
    });

    describe('#userWithAvatar', () => {
      describe('when the sender is an agent', () => {
        beforeAll(() => {
          isAgent = true;
        });

        it('returns false', () => {
          expect(subject.userWithAvatar()).toEqual(false);
        });
      });

      describe('when the sender is an end-user', () => {
        describe('logged in via social media', () => {
          beforeAll(() => {
            isAgent = false;
            socialLogin = { avatarPath: 'heynow' };
          });

          it('returns true', () => {
            expect(subject.userWithAvatar()).toEqual(true);
          });
        });

        describe('not logged in via social media', () => {
          beforeAll(() => {
            isAgent = false;
            socialLogin = undefined;
          });

          it('returns false', () => {
            expect(subject.userWithAvatar()).toEqual(false);
          });
        });
      });
    });

    describe('#hasSocialLoginAvatar', () => {
      describe('when a social login exists', () => {
        beforeAll(() => {
          socialLogin = { avatarPath: 'heynow' };
        });

        it('returns true', () => {
          expect(subject.hasSocialLoginAvatar()).toEqual(true);
        });
      });

      describe('when a social login does not exist', () => {
        beforeAll(() => {
          socialLogin = undefined;
        });

        it('returns false', () => {
          expect(subject.hasSocialLoginAvatar()).toEqual(false);
        });
      });
    });
  });
});
