/** @jsx React.DOM */

describe('FormField component', function() {
  var mockRegistry,
      onSearch,
      formFieldPath = buildSrcPath('component/FormField'),
      SearchField,
      mockSearchField;

  beforeEach(function() {

    onSearch = jasmine.createSpy();

    resetDOM();

    mockery.enable({
      warnOnReplace:false,
      useCleanCache: true
    });

    mockSearchField = React.createClass({
      render: function() {
        return (
          /* jshint quotmark:false */
          <div>
            <i
              onClick={onSearch} />
            <div>
              <input
                ref='searchFieldInput'
                type='search' />
            </div>
          </div>
        );
      }
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/Loading': {
        Loading: noop
      },
      'mixin/validation': {},
      'mixin/formField': {},
      'utility/devices': {
        isMobileBrowser: noop
      },
      'react-forms': {
        Form: mockSearchField,
        FormFor: mockSearchField,
        schema: {
          Property: mockSearchField
        },
        input: noop,
        validation: noop
      },
      'component/FormField': {
        SearchField: noop
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          'init',
          'setLocale',
          'getLocale',
          't',
          'isRTL'
        ])
      }
    });

    mockery.registerAllowable('utility/globals');
    mockery.registerAllowable(formFieldPath);

    SearchField = require(formFieldPath).SearchField;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should call onSearch when search icon is clicked', function() {
    var searchField = React.renderComponent(
          <SearchField onSearchIconClick={onSearch} />,
          global.document.body
        ),
        searchFieldNode = searchField.getDOMNode();

    ReactTestUtils.Simulate.click(searchFieldNode.querySelector('i'));

    expect(onSearch)
      .toHaveBeenCalled();
  });

});