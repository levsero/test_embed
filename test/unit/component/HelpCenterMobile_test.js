describe('HelpCenterMobile component', function() {
  let HelpCenterMobile,
    mockRegistry,
    mockIsMobileBrowserValue,
    mockPageKeywords,
    trackSearch,
    updateResults;

  const searchFieldBlur = jasmine.createSpy();
  const searchFieldGetValue = jasmine.createSpy().and.returnValue('Foobar');
  const helpCenterMobilePath = buildSrcPath('component/HelpCenterMobile');

  beforeEach(function() {
    trackSearch = jasmine.createSpy('trackSearch');
    updateResults = jasmine.createSpy('updateResults');

    resetDOM();

    mockery.enable();

    mockIsMobileBrowserValue = false;
    mockPageKeywords = 'billy bob thorton';

    mockRegistry = initMockRegistry({
      'React': React,
      'component/field/SearchField': {
        SearchField: React.createClass({
          focus: function() {
            this.setState({
              focused: true
            });
          },
          getSearchField: function() {
            return this.refs.searchFieldInput;
          },
          blur: searchFieldBlur,
          getValue: searchFieldGetValue,
          render: function() {
            return (
              <div ref='searchField' type='search'>
                <input ref='searchFieldInput' value='' type='search' />
              </div>
            );
          }
        })
      },
      'component/button/SearchFieldButton': {
        SearchFieldButton: React.createClass({
          render: function() {
            return (
              <input
                ref='searchFieldButton'
                type='search'
                onClick={this.props.onClick} />
            );
          }
        })
      },
      'component/ZendeskLogo': {
        ZendeskLogo: noopReactComponent()
      },
      'component/ScrollContainer': {
        ScrollContainer: React.createClass({
          setScrollShadowVisible: noop,
          render: function() {
            return (
              <div>
                {this.props.headerContent}
                {this.props.children}
                {this.props.footerContent}
              </div>
            );
          }
        })
      },
      'component/Button': {
        Button: React.createClass({
          render: function() {
            return <input className='Button' type='button' />;
          }
        }),
        ButtonGroup: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          init: jasmine.createSpy(),
          setLocale: jasmine.createSpy(),
          getLocale: jasmine.createSpy(),
          isRTL: jasmine.createSpy(),
          t: _.identity
        }
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      }
    });

    mockery.registerAllowable(helpCenterMobilePath);

    HelpCenterMobile = requireUncached(helpCenterMobilePath).HelpCenterMobile;

    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });
});
