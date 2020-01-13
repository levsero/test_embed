describe('ChatHeader component', () => {
  let ChatHeader, mockIsRTL, TEST_IDS
  const chatHeaderPath = buildSrcPath('component/chat/ChatHeader')
  const sharedConstantsPath = buildSrcPath('constants/shared')
  const fontSize = 12

  class MockAvatar extends React.Component {
    render() {
      return <div className="Avatar" />
    }
  }

  beforeEach(() => {
    mockery.enable()

    TEST_IDS = requireUncached(sharedConstantsPath).TEST_IDS

    initMockRegistry({
      'component/Avatar': {
        Avatar: MockAvatar
      },
      'src/embeds/chat/components/RatingGroup': noopReactComponent(),
      'component/button/ButtonIcon': {
        ButtonIcon: class extends Component {
          render = () => {
            return <div className={`${this.props.icon} ${this.props.className}`} />
          }
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity,
          isRTL: () => mockIsRTL
        }
      },
      './ChatHeader.scss': {
        locals: {
          agentDetails: 'agentDetails',
          container: 'container',
          textContainer: 'textContainer',
          ratingIconActive: 'ratingIconActive',
          clickable: 'clickableClasses'
        }
      },
      'src/constants/shared': {
        FONT_SIZE: fontSize,
        TEST_IDS
      }
    })

    mockery.registerAllowable(chatHeaderPath)
    ChatHeader = requireUncached(chatHeaderPath).ChatHeader
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('#render', () => {
    let component

    beforeEach(() => {
      const props = {
        concierges: [
          {
            avatar: 'https://example.com/snake',
            display_name: 'Luke Skywalker',
            title: 'Jedi Knight'
          }
        ]
      }

      component = domRender(<ChatHeader {...props} />)
    })

    it('renders an Avatar', () => {
      expect(() => TestUtils.findRenderedComponentWithType(component, MockAvatar)).not.toThrow()
    })

    it('passes Icon--avatar as the fallback icon to the avatar component', () => {
      const avatar = TestUtils.findRenderedComponentWithType(component, MockAvatar)

      expect(avatar.props.fallbackIcon).toEqual('Icon--avatar')
    })
  })

  describe('renderAvatarContainer', () => {
    let component
    const avatarDetails = {
      avatar: 'https://example.com/snake',
      display_name: 'Luke Skywalker',
      title: 'Jedi Knight'
    }

    describe('when there is one agent', () => {
      beforeEach(() => {
        const props = {
          concierges: [avatarDetails]
        }

        component = domRender(<ChatHeader {...props} />)
        spyOn(component, 'renderAvatars')
        spyOn(component, 'renderOverflow')
        component.renderAvatarContainer()
      })

      it('calls renderAvatars with the concierge details', () => {
        expect(component.renderAvatars).toHaveBeenCalledWith([avatarDetails])
      })

      it('calls renderOverflow with 0', () => {
        expect(component.renderOverflow).toHaveBeenCalledWith(0)
      })
    })

    describe('when there are two agents', () => {
      beforeEach(() => {
        const props = {
          concierges: [avatarDetails, avatarDetails]
        }

        component = domRender(<ChatHeader {...props} />)
        spyOn(component, 'renderAvatars')
        spyOn(component, 'renderOverflow')
        component.renderAvatarContainer()
      })

      it('calls renderAvatars with the concierge details', () => {
        expect(component.renderAvatars).toHaveBeenCalledWith([avatarDetails, avatarDetails])
      })

      it('calls renderOverflow with 0', () => {
        expect(component.renderOverflow).toHaveBeenCalledWith(0)
      })
    })

    describe('when there are three agents', () => {
      beforeEach(() => {
        const props = {
          concierges: [avatarDetails, avatarDetails, avatarDetails]
        }

        component = domRender(<ChatHeader {...props} />)
        spyOn(component, 'renderAvatars')
        spyOn(component, 'renderOverflow')
        component.renderAvatarContainer()
      })

      it('calls renderAvatars with the concierge details', () => {
        expect(component.renderAvatars).toHaveBeenCalledWith([
          avatarDetails,
          avatarDetails,
          avatarDetails
        ])
      })

      it('calls renderOverflow with 0', () => {
        expect(component.renderOverflow).toHaveBeenCalledWith(0)
      })
    })

    describe('when there are more than three agents', () => {
      beforeEach(() => {
        const props = {
          concierges: [avatarDetails, avatarDetails, avatarDetails, avatarDetails]
        }

        component = domRender(<ChatHeader {...props} />)
        spyOn(component, 'renderAvatars')
        spyOn(component, 'renderOverflow')
        component.renderAvatarContainer()
      })

      it('calls renderAvatars with just the first two avatars', () => {
        expect(component.renderAvatars).toHaveBeenCalledWith([avatarDetails, avatarDetails])
      })

      it('calls renderOverflow with the correct value', () => {
        expect(component.renderOverflow).toHaveBeenCalledWith(2)

        let props = {
          concierges: [avatarDetails, avatarDetails, avatarDetails, avatarDetails, avatarDetails]
        }

        component = domRender(<ChatHeader {...props} />)
        expect(component.renderOverflow).toHaveBeenCalledWith(3)

        props = {
          concierges: [...Array(150).keys()].map(() => avatarDetails)
        }

        component = domRender(<ChatHeader {...props} />)
        expect(component.renderOverflow).toHaveBeenCalledWith(99)
      })
    })
  })

  describe('renderAvatars', () => {
    let component, avatars
    const avatarDetails = {
      avatar: 'https://example.com/snake',
      display_name: 'Luke Skywalker',
      title: 'Jedi Knight'
    }

    beforeEach(() => {
      const props = {
        concierges: [avatarDetails, avatarDetails, avatarDetails]
      }

      component = domRender(<ChatHeader {...props} />)
      avatars = component.renderAvatars(props.concierges)
    })

    it('returns an array of Avatars', () => {
      avatars.forEach(avatar => {
        expect(TestUtils.isElementOfType(avatar, MockAvatar)).toEqual(true)
      })
    })
  })

  describe('onAgentDetailsClick', () => {
    let onClickSpy, agentDetailsContainer

    describe('when it is defined', () => {
      describe('when agents are active', () => {
        it('adds the clickable classNames to the agent details container', () => {
          const onClickSpy = jasmine.createSpy()
          const component = domRender(
            <ChatHeader onAgentDetailsClick={onClickSpy} agentsActive={true} />
          )

          const agentDetailsContainer = TestUtils.findRenderedDOMComponentWithClass(
            component,
            'agentDetails'
          )

          expect(agentDetailsContainer.className).toContain('clickableClasses')
        })

        it('sets the onClick of the agent details container to the prop', () => {
          const onClickSpy = jasmine.createSpy()
          const component = domRender(
            <ChatHeader onAgentDetailsClick={onClickSpy} agentsActive={true} />
          )

          const agentDetailsContainer = TestUtils.findRenderedDOMComponentWithClass(
            component,
            'agentDetails'
          )

          agentDetailsContainer.click()

          expect(onClickSpy).toHaveBeenCalled()
        })

        it('renders the agent information as a button', () => {
          const onClickSpy = jasmine.createSpy()
          const component = domRender(
            <ChatHeader onAgentDetailsClick={onClickSpy} agentsActive={true} />
          )

          const agentDetailsContainer = TestUtils.findRenderedDOMComponentWithClass(
            component,
            'agentDetails'
          )

          expect(agentDetailsContainer.tagName).toBe('BUTTON')
        })
      })

      describe('when agents are not active', () => {
        it('does not set the onClick of the agent details container to the prop', () => {
          onClickSpy = jasmine.createSpy()
          const component = instanceRender(
            <ChatHeader onAgentDetailsClick={onClickSpy} agentsActive={false} />
          )

          agentDetailsContainer = component.render().props.children[0]

          expect(agentDetailsContainer.props.onClick).toBe(undefined)
        })
      })

      it('renders the agent information in a div', () => {
        const onClickSpy = jasmine.createSpy()
        const component = domRender(
          <ChatHeader onAgentDetailsClick={onClickSpy} agentsActive={false} />
        )

        const agentDetailsContainer = TestUtils.findRenderedDOMComponentWithClass(
          component,
          'agentDetails'
        )

        expect(agentDetailsContainer.tagName).toBe('DIV')
      })
    })

    beforeEach(() => {
      const component = instanceRender(
        <ChatHeader onAgentDetailsClick={onClickSpy} active={true} />
      )

      agentDetailsContainer = component.render().props.children[0]
    })

    describe('when it is not defined', () => {
      beforeAll(() => {
        onClickSpy = undefined
      })

      it('does not add the clickable classNames to the agent details container', () => {
        expect(agentDetailsContainer.props.className).not.toContain('clickableClasses')
      })
    })
  })

  describe('renderTextContainer', () => {
    let result, component, mockConcierges
    const conciergeTemplate = { display_name: 'Red Spice Road soon' }

    beforeEach(() => {
      component = instanceRender(<ChatHeader concierges={mockConcierges} />)

      spyOn(component, 'renderSubText')

      result = component.renderTextContainer()
    })

    describe('when a display_name exists for a concierge', () => {
      beforeAll(() => {
        mockConcierges = [conciergeTemplate]
      })

      it('renders with the concierge display_name', () => {
        const targetElement = result.props.children[0]

        expect(targetElement.props.children).toEqual(conciergeTemplate.display_name)
      })
    })

    describe('when a display_name does not exist for a concierge', () => {
      beforeAll(() => {
        mockConcierges = [{ display_name: '' }]
      })

      it('renders with a default title text', () => {
        const targetElement = result.props.children[0]

        expect(targetElement.props.children).toEqual(
          'embeddable_framework.chat.header.default.title'
        )
      })
    })
  })

  describe('renderSubText', () => {
    let result, mockConcierges, mockShowRating
    const conciergeTemplate = { title: 'Sizuki Liew' }

    beforeEach(() => {
      const component = instanceRender(
        <ChatHeader showRating={mockShowRating} concierges={mockConcierges} />
      )

      result = component.renderSubText()
    })

    describe('when a title exists for a concierge', () => {
      beforeAll(() => {
        mockConcierges = [conciergeTemplate]
      })

      it('renders with the concierge title', () => {
        expect(result.props.children).toEqual(conciergeTemplate.title)
      })
    })

    describe('when a title does not exist for a concierge', () => {
      beforeAll(() => {
        mockConcierges = [{ title: '' }]
      })

      it('renders with a default by line text', () => {
        expect(result.props.children).toEqual('embeddable_framework.chat.header.by_line')
      })
    })
  })
})
