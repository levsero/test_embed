describe('Container component', () => {
  let Container, TEST_IDS
  const containerPath = buildSrcPath('component/container/Container')
  const sharedConstantsPath = basePath('src/constants/shared')

  beforeEach(() => {
    mockery.enable()

    TEST_IDS = requireUncached(sharedConstantsPath).TEST_IDS

    initMockRegistry({
      React: React,
      './Container.scss': {
        locals: {
          desktop: 'desktopClasses',
          mobile: 'mobileClasses',
          card: 'cardClasses'
        }
      },
      'src/constants/shared': {
        TEST_IDS
      }
    })

    mockery.registerAllowable(containerPath)

    Container = requireUncached(containerPath).Container
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  it('has mobileClasses when props.isMobile is true', () => {
    const container = shallowRender(<Container isMobile={true} />)

    expect(container.props.className).toMatch('mobileClasses')

    expect(container.props.className).not.toMatch('desktopClasses')
  })

  it('has desktopClasses when props.isMobile is false', () => {
    const container = shallowRender(<Container />)

    expect(container.props.className).toMatch('desktopClasses')

    expect(container.props.className).not.toMatch('mobileClasses')
  })

  it('has cardClasses when props.card is true', () => {
    const container = shallowRender(<Container card={true} />)

    expect(container.props.className).toMatch('cardClasses')
  })

  it('does not have cardClasses when props.card is false', () => {
    const container = shallowRender(<Container />)

    expect(container.props.className).not.toMatch('cardClasses')
  })
})
