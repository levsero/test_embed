describe('RatingGroup component', () => {
  let RatingGroup, ChatRatings, TEST_IDS
  const RatingGroupPath = buildSrcPath('component/chat/rating/RatingGroup')
  const IconButton = noopReactComponent()
  const Icon = noopReactComponent()
  const sharedConstantsPath = basePath('src/constants/shared')

  beforeEach(() => {
    mockery.enable()

    TEST_IDS = requireUncached(sharedConstantsPath).TEST_IDS

    initMockRegistry({
      './RatingGroup.scss': {
        locals: {
          ratingIconActive: 'ratingIconActive',
          ratingIcon: 'ratingIcon',
          leftRatingIcon: 'leftRatingIcon',
          container: 'container',
          thumbDownIcon: 'thumbDownIcon'
        }
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
      },
      'component/Icon': { Icon },
      '@zendeskgarden/react-buttons': { IconButton },
      'src/constants/shared': {
        TEST_IDS
      }
    })

    mockery.registerAllowable(RatingGroupPath)
    RatingGroup = requireUncached(RatingGroupPath).RatingGroup
    ChatRatings = requireUncached(RatingGroupPath).ratings
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('render', () => {
    let RatingGroupNode

    describe('when the rating value is good', () => {
      beforeEach(() => {
        const component = domRender(<RatingGroup rating={ChatRatings.GOOD} />)

        RatingGroupNode = ReactDOM.findDOMNode(component)
      })

      it('renders active styles for thumbUp button', () => {
        const buttonIconNode = RatingGroupNode.querySelectorAll('.ratingIcon')[0]

        expect(buttonIconNode.className).toContain('ratingIconActive')
      })

      it('does not render active styles for thumbDown button', () => {
        const buttonIconNode = RatingGroupNode.querySelectorAll('.ratingIcon')[1]

        expect(buttonIconNode.className).not.toContain('ratingIconActive')
      })
    })

    describe('when the rating value is bad', () => {
      beforeEach(() => {
        const component = domRender(<RatingGroup rating={ChatRatings.BAD} />)

        RatingGroupNode = ReactDOM.findDOMNode(component)
      })

      it('renders active styles for thumbDown button', () => {
        const buttonIconNode = RatingGroupNode.querySelectorAll('.ratingIcon')[1]

        expect(buttonIconNode.className).toContain('ratingIconActive')
      })

      it('does not render active styles for thumbDown button', () => {
        const buttonIconNode = RatingGroupNode.querySelectorAll('.ratingIcon')[0]

        expect(buttonIconNode.className).not.toContain('ratingIconActive')
      })
    })

    describe('when the rating value is falsy', () => {
      let thumbUpNode, thumbDownNode

      beforeEach(() => {
        const component = domRender(<RatingGroup />)

        RatingGroupNode = ReactDOM.findDOMNode(component)
        thumbUpNode = RatingGroupNode.querySelectorAll('.ratingIcon')[0]
        thumbDownNode = RatingGroupNode.querySelectorAll('.ratingIcon')[1]
      })

      it('renders both buttons without active styles', () => {
        expect(thumbUpNode.className).not.toContain('ratingIconActive')

        expect(thumbDownNode.className).not.toContain('ratingIconActive')
      })
    })
  })

  describe('ratingClickedHandler', () => {
    let component, mockUpdateRating, mockRating

    describe('when an existing rating does not exist', () => {
      beforeEach(() => {
        mockUpdateRating = jasmine.createSpy('updateRating')
        mockRating = ChatRatings.GOOD

        component = instanceRender(<RatingGroup updateRating={mockUpdateRating} />)
        component.ratingClickedHandler(mockRating)
      })

      it('calls updateRating with the new rating', () => {
        expect(mockUpdateRating).toHaveBeenCalledWith(mockRating)
      })
    })

    describe('when an existing rating exists', () => {
      beforeEach(() => {
        mockUpdateRating = jasmine.createSpy('updateRating')
        mockRating = ChatRatings.GOOD

        component = instanceRender(
          <RatingGroup rating={mockRating} updateRating={mockUpdateRating} />
        )
      })

      it('calls updateRating with the new rating for a different', () => {
        component.ratingClickedHandler(ChatRatings.BAD)

        expect(mockUpdateRating).toHaveBeenCalledWith(ChatRatings.BAD)
      })

      it('calls updateRating with null for the same rating', () => {
        component.ratingClickedHandler(mockRating)

        expect(mockUpdateRating).toHaveBeenCalledWith(null)
      })
    })
  })
})
