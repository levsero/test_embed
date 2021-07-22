describe('UserProfile component', () => {
  let UserProfile
  const UserProfilePath = buildSrcPath('component/chat/UserProfile')
  const chatConstantsPath = buildSrcPath('constants/chat')
  const Icon = noopReactComponent()
  const LoadingSpinner = noopReactComponent()
  const Avatar = noopReactComponent()
  const SocialLoginGroup = noopReactComponent()

  let chatConstants = requireUncached(chatConstantsPath)
  let CHAT_SOCIAL_LOGIN_SCREENS = chatConstants.CHAT_SOCIAL_LOGIN_SCREENS

  beforeEach(() => {
    mockery.enable()

    initMockRegistry({
      './UserProfile.scss': {
        locals: {
          authProfileFieldContainer: 'authProfileFieldContainerClasses',
          historyAuthProfileFieldContainer: 'historyAuthProfileFieldContainerClasses',
        },
      },
      'src/constants/chat': {
        CHAT_SOCIAL_LOGIN_SCREENS,
      },
      'src/component/Icon': { Icon },
      'src/component/loading/LoadingSpinner': { LoadingSpinner },
      'src/embeds/chat/components/SocialLogin': SocialLoginGroup,
      'src/component/Avatar': { Avatar },
      'src/apps/webWidget/services/i18n': {
        i18n: {
          t: _.identity,
        },
      },
    })

    mockery.registerAllowable(UserProfilePath)
    UserProfile = requireUncached(UserProfilePath).UserProfile
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('render', () => {
    let component, componentArgs

    beforeEach(() => {
      component = instanceRender(<UserProfile {...componentArgs} />)

      spyOn(component, 'renderAuthedProfileField')
      spyOn(component, 'renderDefaultProfileFields')

      component.render()
    })

    describe('when social login is authenticated', () => {
      beforeAll(() => {
        componentArgs = {
          socialLogin: {
            authenticated: true,
          },
        }
      })

      it('calls renderAuthedProfileField', () => {
        expect(component.renderAuthedProfileField).toHaveBeenCalled()

        expect(component.renderDefaultProfileFields).not.toHaveBeenCalled()
      })
    })

    describe('when social login is not authenticated', () => {
      beforeAll(() => {
        componentArgs = {
          socialLogin: {
            authenticated: false,
          },
        }
      })

      it('calls renderDefaultProfileFields', () => {
        expect(component.renderDefaultProfileFields).toHaveBeenCalled()

        expect(component.renderAuthedProfileField).not.toHaveBeenCalled()
      })
    })
  })

  describe('renderSocialLoginField', () => {
    it('renders the social login option', () => {
      const component = domRender(
        <UserProfile
          socialLogin={{ authenticated: true }}
          authUrls={[
            {
              Goggle:
                'https://www.zopim.com/auth/goggle/3DsjCpVY6RGFpfrfQk88xJ6DqnM82JMJ-mJhKBcIWnWUWJY',
            },
          ]}
        />
      )

      expect(() => TestUtils.findRenderedComponentWithType(component, SocialLoginGroup)).toThrow()
    })
  })

  describe('renderAuthedProfileField', () => {
    let result, componentArgs

    beforeEach(() => {
      const component = instanceRender(<UserProfile {...componentArgs} />)

      result = component.renderAuthedProfileField()
    })

    describe('when authenitcated via social auth', () => {
      describe('when the screen is pending logout', () => {
        beforeAll(() => {
          componentArgs = {
            socialLogin: {
              authenticated: true,
              screen: CHAT_SOCIAL_LOGIN_SCREENS.LOGOUT_PENDING,
            },
          }
        })

        it('renders a LoadingSpinner', () => {
          const authContainer = result.props.children[1]
          const targetElement = authContainer.props.children[2]

          expect(TestUtils.isElementOfType(targetElement, LoadingSpinner)).toEqual(true)
        })

        it('has a profile with authProfileFieldContainer classes', () => {
          const authContainer = result.props.children[1]
          const targetElement = authContainer.props.children[1]

          expect(targetElement.props.className).toEqual('authProfileFieldContainerClasses')
        })
      })

      describe('when the screen is not pending logout', () => {
        beforeAll(() => {
          componentArgs = {
            socialLogin: {
              authenticated: true,
              screen: CHAT_SOCIAL_LOGIN_SCREENS.LOGOUT_SUCCESS,
            },
          }
        })

        it('renders an Icon', () => {
          const authContainer = result.props.children[1]
          const targetElement = authContainer.props.children[2]

          expect(TestUtils.isElementOfType(targetElement, Icon)).toEqual(true)
        })

        it('renders a child for the avatar, details and logout button', () => {
          const authContainer = result.props.children[1]

          expect(authContainer.props.children.length > 0).toBe(true)

          _.forEach(authContainer.props.children, (child) => {
            expect(child).toBeTruthy()
          })
        })
      })
    })

    describe('when authenticated via jwt token', () => {
      beforeAll(() => {
        componentArgs = {
          socialLogin: {},
          isAuthenticated: true,
        }
      })

      it('only renders a child for the details', () => {
        const authContainer = result.props.children[1]

        expect(authContainer.props.children[0]).toBeFalsy()
        expect(authContainer.props.children[1]).toBeTruthy()
        expect(authContainer.props.children[2]).toBeFalsy()
      })

      it('has a profile with historyAuthProfileFieldContainer classes', () => {
        const authContainer = result.props.children[1]
        const targetElement = authContainer.props.children[1]

        expect(targetElement.props.className).toEqual('historyAuthProfileFieldContainerClasses')
      })
    })
  })
})
